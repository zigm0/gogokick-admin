<?php
namespace App\Service;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;

/**
 * Class ScreenshotService
 */
class ScreenshotService
{
    /**
     * @var string
     */
    protected $puppetUrl;

    /**
     * Constructor
     *
     * @param string $puppetUrl
     */
    public function __construct($puppetUrl)
    {
        $this->puppetUrl = $puppetUrl;
    }

    /**
     * @param string $url
     * @param string $selector
     *
     * @return string
     * @throws Exception
     */
    public function fetch($url, $selector = 'body')
    {
        try {
            $guzzle   = new Client();
            $response = $guzzle->post(sprintf('%s/screenshot', $this->puppetUrl), [
                RequestOptions::JSON => [
                    'url'      => $url,
                    'selector' => $selector
                ]
            ]);
        } catch (Exception $e) {
            throw $e;
        }

        return (string)$response->getBody();
    }
}
