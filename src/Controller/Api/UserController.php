<?php
namespace App\Controller\Api;

use App\Http\Request;
use App\Security\LoginFormAuthenticator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

/**
 * @Route("/api/user", name="api_user", options={"expose"=true})
 */
class UserController extends ApiController
{
    /**
     * @Route("/me", name="_me", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function meAction()
    {
        $user = $this->getUser();

        return $this->jsonEntityResponse($user);
    }

    /**
     * @Route("/login", name="_login", methods={"POST"})
     *
     * @param Request                $request
     * @param LoginFormAuthenticator $authenticator
     * @param UserProviderInterface  $userProvider
     * @param TokenStorageInterface  $tokenStorage
     *
     * @return JsonResponse
     */
    public function loginAction(
        Request $request,
        LoginFormAuthenticator $authenticator,
        UserProviderInterface $userProvider,
        TokenStorageInterface $tokenStorage
    )
    {
        $credentials = $request->json->all();
        $user = $authenticator->getUser($credentials, $userProvider);
        if (!$user || !$authenticator->checkCredentials($credentials, $user)) {
            return new JsonResponse(['_error' => 'Email or password incorrect.']);
        }

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $tokenStorage->setToken($token);
        $request->getSession()->set('_security_main', serialize($token));
        $event = new InteractiveLoginEvent($request, $token);
        $this->eventDispatcher->dispatch('security.interactive_login', $event);

        return $this->jsonEntityResponse($user);
    }

    /**
     * @Route("/logout", name="_logout", methods={"POST"})
     *
     * @param Request                $request
     * @param TokenStorageInterface  $tokenStorage
     *
     * @return JsonResponse
     */
    public function logoutAction(Request $request, TokenStorageInterface $tokenStorage)
    {
        $tokenStorage->setToken(null);
        $request->getSession()->invalidate();

        return new JsonResponse('ok');
    }
}
