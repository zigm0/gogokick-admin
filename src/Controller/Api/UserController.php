<?php
namespace App\Controller\Api;

use App\Entity\Media;
use App\Entity\User;
use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\ProfileModel;
use App\Repository\UserRepository;
use App\Security\LoginFormAuthenticator;
use DateTime;
use Exception;
use LasseRafn\InitialAvatarGenerator\InitialAvatar;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
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
     * @Route(name="_save", methods={"POST"})
     *
     * @param Request             $request
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     */
    public function saveAction(Request $request, ModelRequestHandler $handler)
    {
        $profile = new ProfileModel();
        $handler->handleRequest($profile, $request);

        /** @var User $user */
        $user = $this->getUser();
        $user
            ->setName($profile->getName())
            ->setBio($profile->getBio())
            ->setSkills($profile->getSkills())
            ->setSocial($profile->getSocial())
            ->setAvatar($profile->getAvatar());
        $this->em->flush();

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

        try {
            $user->setDateLastLogin(new DateTime());
            $this->em->flush();
        } catch (Exception $e) {}

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

    /**
     * @Route("/register", name="_register", methods={"POST"})
     *
     * @param Request                $request
     * @param UserRepository $userRepository
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param TokenStorageInterface  $tokenStorage
     *
     * @return JsonResponse
     */
    public function registerAction(
        Request $request,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $passwordEncoder,
        TokenStorageInterface $tokenStorage
    )
    {
        $email = trim($request->json->get('email'));
        $name  = trim($request->json->get('name'));
        $pass  = trim($request->json->get('password'));

        if (empty($email) || empty($name) || empty($pass)) {
            return new JsonResponse(['_error' => 'All fields are required.']);
        }

        $user = $userRepository->findOneBy(['email' => $email]);
        if ($user) {
            return new JsonResponse(['_error' => 'Email address taken.']);
        }

        $colors = [
            '#929D9E',
            '#FB8122',
            '#3CBCC3',
            '#438945',
            '#2CCCC3',
            '#FDD935',
            '#E42C6A',
            '#FB9039',
            '#C60021',
            '#849531',
            '#B3E3B5'
        ];
        $index  = mt_rand(0, count($colors));
        $avatar = new InitialAvatar();
        $image  = $avatar
            ->width(100)
            ->height(100)
            ->background($colors[$index])
            ->name($name[0])
            ->generate();
        $data = $image->encode('jpg');
        $path = sprintf('%d-%s.jpg', microtime(true), uniqid());
        $url  = $this->cdn->upload('avatars', $path, $data);

        $user = (new User())
            ->setEmail($email)
            ->setName($name)
            ->setIsEnabled(true)
            ->addRole(User::ROLE_USER)
            ->setAvatar($url);
        $user->setPassword(
            $passwordEncoder->encodePassword($user, $pass)
        );

        $media = (new Media())
            ->setUrl($url)
            ->setSystem('avatars')
            ->setPath($path)
            ->setOrigFilename($path)
            ->setUser($user);
        $this->em->persist($user);
        $this->em->persist($media);
        $this->em->flush();

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $tokenStorage->setToken($token);
        $request->getSession()->set('_security_main', serialize($token));
        $event = new InteractiveLoginEvent($request, $token);
        $this->eventDispatcher->dispatch('security.interactive_login', $event);

        return $this->jsonEntityResponse($user);
    }

    /**
     * @Route("/profile/{id}", name="_profile", methods={"GET"})
     *
     * @param int $id
     * @param UserRepository $repository
     *
     * @return JsonResponse
     */
    public function profileAction($id, UserRepository $repository)
    {
        $user = $repository->findByID($id);
        if (!$user) {
            throw $this->createNotFoundException();
        }

        return $this->jsonEntityResponse($user);
    }
}
