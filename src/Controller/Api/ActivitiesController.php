<?php
namespace App\Controller\Api;

use App\Repository\ActivityRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/activities", name="api_activities", options={"expose"=true})
 */
class ActivitiesController extends ApiController
{
    /**
     * @Route(name="_fetch", methods={"GET"})
     *
     * @param ActivityRepository $repository
     *
     * @return JsonResponse
     */
    public function fetchAction(ActivityRepository $repository)
    {
        $activities = $repository->findByRelatedUser($this->getUser());
        $activities = $this->arrayEntityGroup($activities);
        foreach($activities as &$activity) {
            $activity = $this->sanitizeActivity($activity);
        }

        return new JsonResponse($activities);
    }
}
