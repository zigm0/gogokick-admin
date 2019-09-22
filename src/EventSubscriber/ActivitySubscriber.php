<?php
namespace App\EventSubscriber;

use App\Event\ActivityEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class ActivitySubscriber
 */
class ActivitySubscriber implements EventSubscriberInterface
{

    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents()
    {
        return [
            'app.activity' => 'onActivity'
        ];
    }

    /**
     * @param ActivityEvent $event
     */
    public function onActivity(ActivityEvent $event)
    {
        // Do something
    }
}
