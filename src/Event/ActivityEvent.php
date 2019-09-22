<?php
namespace App\Event;

use App\Entity\Activity;
use Symfony\Component\EventDispatcher\Event;

/**
 * Class ActivityEvent
 */
class ActivityEvent extends Event
{
    /**
     * @var Activity
     */
    protected $activity;

    /**
     * Constructor
     *
     * @param Activity $activity
     */
    public function __construct(Activity $activity)
    {
        $this->activity = $activity;
    }

    /**
     * @return Activity
     */
    public function getActivity()
    {
        return $this->activity;
    }
}
