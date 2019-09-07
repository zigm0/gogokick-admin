<?php
namespace App\Http;

use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyAccess\PropertyAccessor;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;

/**
 * Class ModelRequestHandler
 */
class ModelRequestHandler
{
    /**
     * @var ValidatorInterface
     */
    protected $validator;

    /**
     * @var PropertyAccessor
     */
    protected $propertyAccessor;

    /**
     * @var ConstraintViolationList
     */
    protected $errors;

    /**
     * Constructor
     *
     * @param ValidatorInterface $validator
     */
    public function __construct(ValidatorInterface $validator)
    {
        $this->validator        = $validator;
        $this->propertyAccessor = PropertyAccess::createPropertyAccessor();
    }

    /**
     * @param object $obj
     * @param Request|array $request
     * @param bool $validate
     *
     * @return object
     */
    public function handleRequest($obj, $request, $validate = true)
    {
        if ($request instanceof Request) {
            if ($request->isMethod('GET')) {
                $request = $request->query->all();
            } else if ($request->getContentType() === 'json') {
                $request = $request->json->all();
            } else {
                $request = $request->request->all();
            }
        }
        if (!is_array($request)) {
            throw new InvalidArgumentException('Request must be an array or Request instance.');
        }

        foreach($request as $key => $value) {
            if ($this->propertyAccessor->isWritable($obj, $key)) {
                $this->propertyAccessor->setValue($obj, $key, $value);
            }
        }

        if ($validate && !$this->isValid($obj)) {
            throw new BadRequestHttpException((string)$this->getErrors());
        }

        return $obj;
    }

    /**
     * @return ConstraintViolationList
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * @param object $obj
     *
     * @return bool
     */
    public function isValid($obj)
    {
        $this->errors = $this->validator->validate($obj);

        return count($this->errors) === 0;
    }
}
