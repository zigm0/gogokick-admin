<?php
namespace App\Controller\Api;

use App\Entity\Activity;
use App\Entity\Invite;
use App\Entity\ProjectUser;
use App\Event\ActivityEvent;
use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\InviteModel;
use App\Model\ProjectUserModel;
use App\Repository\InviteRepository;
use App\Repository\ProjectUserRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Swift_Mailer;
use Swift_Message;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @Route("/api/team", name="api_team", options={"expose"=true}, requirements={"id"="\d+"})
 */
class TeamController extends ApiController
{
    /**
     * @Route("/invite", name="_invite", methods={"POST"})
     *
     * @param Request             $request
     * @param ModelRequestHandler $handler
     * @param InviteRepository    $repository
     * @param Swift_Mailer        $mailer
     *
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function inviteAction(
        Request $request,
        ModelRequestHandler $handler,
        InviteRepository $repository,
        Swift_Mailer $mailer
    )
    {
        $model = new InviteModel();
        $handler->handleRequest($model, $request);
        $email = $model->getEmail();
        $roles = $model->getRoles();

        $project = $this->getProject($model->getProject());
        if ($invite = $repository->findByProjectAndEmail($project, $email)) {
            $this->em->remove($invite);
        }

        foreach($project->getTeam() as $projectUser) {
            if ($projectUser->getUser()->getEmail() === $email) {
                return new JsonResponse([
                    '_error' => 'User is already a member of this project.'
                ]);
            }
        }

        $invite = $repository->create($project, $email, $roles);
        $url    = $this->generateUrl(
            'invite_accept',
            ['hash' => $invite->getHash(), 'id' => $invite->getId()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $params = [
            'url'        => $url,
            'invite'     => $invite,
            'isLead'     => in_array(ProjectUser::ROLE_LEAD, $roles),
            'isWriter'   => in_array(ProjectUser::ROLE_WRITER, $roles),
            'isGraphics' => in_array(ProjectUser::ROLE_GRAPHICS, $roles),
            'isVideo'    => in_array(ProjectUser::ROLE_VIDEO, $roles),
            'isAudio'    => in_array(ProjectUser::ROLE_AUDIO, $roles)
        ];

        $message = (new Swift_Message('Invitation to GoGoKick project'))
            ->setFrom('noreply@gogokick.com')
            ->setTo($email)
            ->setBody(
                $this->renderView('_emails/invite.html.twig', $params),
                'text/html'
            )
            ->addPart(
                $this->renderView('_emails/invite.txt.twig', $params),
                'text/plain'
            )
        ;

        $mailer->send($message);

        return $this->jsonEntityResponse($invite);
    }

    /**
     * @Route("/{id}", name="_update", methods={"POST"})
     *
     * @param int                   $id
     * @param Request               $request
     * @param ProjectUserRepository $repository
     * @param ModelRequestHandler   $handler
     *
     * @return JsonResponse
     */
    public function updateAction($id, Request $request, ProjectUserRepository $repository, ModelRequestHandler $handler)
    {
        $projectUser = $repository->findByID($id);
        if (!$projectUser) {
            throw $this->createNotFoundException();
        }

        $model = new ProjectUserModel();
        $handler->handleRequest($model, $request);

        $projectUser->setRoles($model->getRoles());
        $this->em->flush();

        return $this->jsonEntityResponse($projectUser);
    }

    /**
     * @Route("/{id}", name="_delete", methods={"DELETE"})
     *
     * @param int $id
     * @param ProjectUserRepository $repository
     *
     * @return JsonResponse
     */
    public function removeAction($id, ProjectUserRepository $repository)
    {
        $projectUser = $repository->findByID($id);
        if (!$projectUser) {
            throw $this->createNotFoundException();
        }

        $this->em->remove($projectUser);
        $this->em->flush();

        return new JsonResponse('ok');
    }

    /**
     * @Route("/invite/{id}/{hash}", name="_accept_invite", methods={"POST"})
     *
     * @param int              $id
     * @param string           $hash
     * @param InviteRepository $repository
     *
     * @return JsonResponse
     */
    public function acceptInviteAction($id, $hash, InviteRepository $repository)
    {
        $invite = $repository->findByID($id);
        if (!$invite || $invite->getHash() !== $hash || $invite->getStatus() !== Invite::STATUS_WAITING) {
            throw $this->createNotFoundException();
        }

        $user    = $this->getUser();
        $project = $invite->getProject();
        if (!$project->hasTeamMember($user)) {
            $projectUser = (new ProjectUser())
                ->setProject($project)
                ->setRoles($invite->getRoles())
                ->setUser($user);
            $this->em->persist($projectUser);
        }

        $invite->setStatus(Invite::STATUS_ACCEPTED);

        $activity = (new Activity())
            ->setProject($project)
            ->setUser($user)
            ->setMessage('')
            ->setType(Activity::TYPE_INVITE_ACCEPTED);
        $this->em->persist($activity);

        $this->em->flush();

        $this->eventDispatcher->dispatch('app.activity', new ActivityEvent($activity));

        return new JsonResponse(sprintf('/editor/%d', $invite->getProject()->getId()));
    }
}
