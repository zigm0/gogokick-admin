<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/help", name="help")
 */
class HelpController extends Controller
{
    /**
     * @Route("/", name="_index", options={"expose"=true})
     */
    public function indexAction()
    {
        return $this->render('help/index.html.twig');
    }
}
