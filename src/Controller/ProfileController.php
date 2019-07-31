<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/profile", name="profile")
 */
class ProfileController extends Controller
{
    /**
     * @Route(name="_index", options={"expose"=true})
     */
    public function indexAction()
    {
        return $this->render('profile/index.html.twig');
    }
}
