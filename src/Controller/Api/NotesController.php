<?php
namespace App\Controller\Api;

use App\Entity\Activity;
use App\Entity\Note;
use App\Http\Request;
use App\Repository\NoteRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/notes", name="api_notes", options={"expose"=true})
 */
class NotesController extends ApiController
{
    /**
     * @Route("/block/{blockID}", name="_fetch", methods={"GET"})
     *
     * @param int            $blockID
     * @param NoteRepository $repository
     *
     * @return JsonResponse
     */
    public function fetchAction($blockID, NoteRepository $repository)
    {
        $block = $this->getBlock($blockID);
        $notes = $repository->findByBlock($block);

        return $this->jsonEntityResponse($notes);
    }

    /**
     * @Route("/block/{blockID}", name="_save", methods={"POST"})
     *
     * @param int            $blockID
     * @param Request        $request
     * @param NoteRepository $repository
     *
     * @return JsonResponse
     */
    public function saveAction($blockID, Request $request, NoteRepository $repository)
    {
        $user    = $this->getUser();
        $block   = $this->getBlock($blockID);
        $message = $request->json->get('message');
        if (!$message) {
            throw new BadRequestHttpException('Missing message');
        }

        $note = (new Note())
            ->setUser($user)
            ->setBlock($block)
            ->setText($message);
        $this->em->persist($note);

        $activity = (new Activity())
            ->setUser($user)
            ->setNote($note)
            ->setMessage('')
            ->setType(Activity::TYPE_BLOCK_NOTE);
        $this->em->persist($activity);

        $this->em->flush();

        $notes = $repository->findByBlock($block);

        return $this->jsonEntityResponse($notes);
    }
}
