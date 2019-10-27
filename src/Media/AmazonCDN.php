<?php
namespace App\Media;

use Aws\CloudFront\CloudFrontClient;
use Aws\S3\S3Client;
use RuntimeException;

/**
 * Class AmazonCDN
 */
class AmazonCDN implements CDNInterface
{
    /**
     * @var S3Client
     */
    protected $s3;

    /**
     * @var CloudFrontClient
     */
    protected $cloudFront;

    /**
     * @var array
     */
    protected $config;

    /**
     * @var MimeTypes
     */
    protected $mimeTypes;

    /**
     * Constructor
     *
     * @param S3Client  $s3
     * @param CloudFrontClient $cloudFront
     * @param array     $config
     * @param MimeTypes $mimeTypes
     */
    public function __construct(S3Client $s3, CloudFrontClient $cloudFront, array $config, MimeTypes $mimeTypes)
    {
        $this->s3         = $s3;
        $this->cloudFront = $cloudFront;
        $this->config     = $config;
        $this->mimeTypes  = $mimeTypes;
    }

    /**
     * {@inheritDoc}
     */
    public function upload($system, $path, $data, $headers = [])
    {
        $config = $this->getSystemConfig($system);
        $key    = $this->getSystemPath($system, $path);

        $req = array_merge([
            'Bucket'       => $config['s3']['bucket'],
            'Key'          => $key,
            'Body'         => $data,
            'ContentType'  => $this->mimeTypes->getFromFilename($path),
            'CacheControl' => $config['s3']['cacheControl'],
            'ACL'          => 'public-read',
        ], $headers);

        $this->s3->putObject($req);

        return $this->resolveUrl($system, $path);
    }

    /**
     * {@inheritDoc}
     */
    public function download($system, $path)
    {
        $config = $this->getSystemConfig($system);
        $key    = $this->getSystemPath($system, $path);

        $results = $this->s3->getObject([
            'Bucket' => $config['s3']['bucket'],
            'Key'    => $key
        ]);

        return (string)$results['Body'];
    }

    /**
     * {@inheritDoc}
     */
    public function remove($system, $path)
    {
        $config = $this->getSystemConfig($system);
        $key    = $this->getSystemPath($system, $path);

        $this->s3->deleteObject([
            'Bucket' => $config['s3']['bucket'],
            'Key'    => $key,
        ]);

        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function removeByURL($url)
    {
        $parts = parse_url($url);
        $path  = ltrim($parts['path'], '/');
        list($system, $path) = explode('/', $path, 2);

        return $this->remove($system, $path);
    }

    /**
     * {@inheritDoc}
     */
    public function invalidate($system, $path)
    {
        $config = $this->getSystemConfig($system);
        $key    = $this->getSystemPath($system, $path);

        $this->cloudFront->createInvalidation([
            'DistributionId' => $config['cloudfront']['id'],
            'InvalidationBatch' => [
                'CallerReference' => $key,
                'Paths' => [
                    'Items' => ['/' . $key],
                    'Quantity' => 1,
                ]
            ]
        ]);

        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function resolveUrl($system, $path, $verify = false)
    {
        $config = $this->getSystemConfig($system);
        $key    = $this->getSystemPath($system, $path);

        if ($verify) {
            if (!$this->s3->doesObjectExist($config['s3']['bucket'], $key)) {
                throw new RuntimeException(
                    sprintf(
                        'Unable to resolve s3://%s/%s',
                        $config['s3']['bucket'],
                        $key
                    )
                );
            }
        }

        return sprintf('https://%s/%s', $config['cloudfront']['url'], $key);
    }

    /**
     * @param string $system
     *
     * @return array
     */
    protected function getSystemConfig($system)
    {
        if (!isset($this->config[$system])) {
            throw new RuntimeException("Invalid CDN system ${system}.");
        }

        return $this->config[$system];
    }

    /**
     * @param string $system
     * @param string $path
     *
     * @return string
     */
    protected function getSystemPath($system, $path)
    {
        $config = $this->getSystemConfig($system);
        $path   = sprintf('%s/%s', trim($config['s3']['folder'], '/'), trim($path, '/'));

        return $path;
    }
}
