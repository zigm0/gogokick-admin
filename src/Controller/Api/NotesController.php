<?php
namespace App\Controller\Api;

use App\Entity\Activity;
use App\Entity\Note;
use App\Event\ActivityEvent;
use App\Http\Request;
use App\Repository\ActivityRepository;
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
        $user       = $this->getUser();
        $block      = $this->getBlock($blockID);
        $message    = $request->request->get('message');
        $attachment = $request->files->get('attachment');
        if (!$message && !$attachment) {
            throw new BadRequestHttpException('Missing message');
        }
        if (!$message) {
            $message = '';
        }

        $note = (new Note())
            ->setUser($user)
            ->setBlock($block)
            ->setText($message)
            ->setAttachmentName('')
            ->setAttachmentUrl('');
        $this->em->persist($note);

        if ($attachment) {
            $ext  = pathinfo($attachment->getClientOriginalName(), PATHINFO_EXTENSION);
            $data = file_get_contents($attachment->getPathName());
            $path = sprintf('%d-%s.%s', microtime(true), uniqid(), $ext);
            $url  = $this->cdn->upload('attachments', $path, $data, [
                'ContentDisposition' => sprintf('attachment; filename="%s"', $attachment->getClientOriginalName()),
                'MetadataDirective'  => 'REPLACE'
            ]);
            $note->setAttachmentUrl($url);
            $note->setAttachmentName($attachment->getClientOriginalName());
        }

        $activity = (new Activity())
            ->setUser($user)
            ->setNote($note)
            ->setMessage('')
            ->setType(Activity::TYPE_BLOCK_NOTE);
        $this->em->persist($activity);
        $this->em->flush();
        $this->eventDispatcher->dispatch('app.activity', new ActivityEvent($activity));

        $notes = $repository->findByBlock($block);

        return $this->jsonEntityResponse($notes);
    }

    /**
     * @Route("/{id}", name="_delete", methods={"DELETE"})
     *
     * @param int                $id
     * @param NoteRepository     $noteRepository
     * @param ActivityRepository $activityRepository
     *
     * @return JsonResponse
     */
    public function deleteAction($id, NoteRepository $noteRepository, ActivityRepository $activityRepository)
    {
        $note = $noteRepository->findByID($id);
        if ($url = $note->getAttachmentUrl()) {
            $this->cdn->removeByURL($url);
        }
        $this->em->remove($note);

        foreach($activityRepository->findByNote($note) as $activity) {
            $this->em->remove($activity);
        }

        $this->em->flush();

        return new JsonResponse('ok');
    }
}
