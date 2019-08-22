<?php
namespace App\Controller\Api;

use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\InviteModel;
use App\Model\ProjectUserModel;
use App\Repository\InviteRepository;
use App\Repository\ProjectUserRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Swift_Mailer;
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

        $project = $this->getProject($model->getProject());
        if ($repository->findByProjectAndEmail($project, $email)) {
            return new JsonResponse([
                '_error' => 'User has already been invited to this project.'
            ]);
        }
        foreach($project->getTeam() as $projectUser) {
            if ($projectUser->getUser()->getEmail() === $email) {
                return new JsonResponse([
                    '_error' => 'User has already been invited to this project.'
                ]);
            }
        }

        $invite = $repository->create($project, $email, $model->getRoles());
        $url    = $this->generateUrl(
            'invite_accept',
            ['hash' => $invite->getHash(), 'id' => $invite->getId()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $message = (new \Swift_Message('Hello Email'))
            ->setFrom('invites@gogokick.com')
            ->setTo($email)
            ->setBody(
                $this->renderView(
                    '_emails/invite.html.twig',
                    ['invite' => $invite, 'url' => $url]
                ),
                'text/html'
            )
            ->addPart(
                $this->renderView(
                    '_emails/invite.txt.twig',
                    ['invite' => $invite, 'url' => $url]
                ),
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
}
