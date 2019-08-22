<?php
namespace App\Controller;

use App\Entity\Invite;
use App\Entity\ProjectUser;
use App\Http\Request;
use App\Repository\InviteRepository;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class InviteController
 */
class InviteController extends Controller
{
    /**
     * @Route("/invite/{id}/{hash}", name="invite_accept")
     *
     * @param int              $id
     * @param string           $hash
     * @param Request          $request
     * @param InviteRepository $repository
     *
     * @return RedirectResponse
     */
    public function inviteAction($id, $hash, Request $request, InviteRepository $repository)
    {
        $invite = $repository->findByID($id);
        if (!$invite || $invite->getHash() !== $hash || $invite->getStatus() !== Invite::STATUS_WAITING) {
            throw $this->createNotFoundException();
        }

        $user = $this->getUser();
        if (!$user) {
            $back = $this->generateUrl('invite_accept', ['id' => $id, 'hash' => $hash]);
            $request->getSession()->set('back', $back);

            return $this->redirectToRoute('login');
        }

        $found = false;
        foreach($invite->getProject()->getTeam() as $projectUser) {
            if ($projectUser->getId() === $user->getId()) {
                $found = true;
                break;
            }
        }

        if (!$found) {
            $projectUser = (new ProjectUser())
                ->setProject($invite->getProject())
                ->setRoles($invite->getRoles())
                ->setUser($user);
            $this->em->persist($projectUser);
        }
        $invite->setStatus(Invite::STATUS_ACCEPTED);
        $this->em->flush();

        return $this->redirectToRoute('editor_project', ['id' => $invite->getProject()->getId()]);
    }
}
