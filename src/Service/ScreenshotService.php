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
     * @param string $html
     * @param array $options "width", "height", "selector"
     *
     * @return string
     * @throws Exception
     */
    public function screenshot($html, array $options = [])
    {
        try {
            $guzzle   = new Client();
            $response = $guzzle->post(sprintf('%s/screenshot', $this->puppetUrl), [
                RequestOptions::JSON => [
                    'html'    => $html,
                    'options' => $options
                ]
            ]);
        } catch (Exception $e) {
            throw $e;
        }

        return (string)$response->getBody();
    }

    /**
     * @param string $url
     * @param array $options "width", "height", "selector"
     *
     * @return string
     * @throws Exception
     */
    public function screenshotURL($url, array $options = [])
    {
        try {
            $guzzle   = new Client();
            $response = $guzzle->post(sprintf('%s/screenshot', $this->puppetUrl), [
                RequestOptions::JSON => [
                    'url'     => $url,
                    'options' => $options
                ]
            ]);
        } catch (Exception $e) {
            throw $e;
        }

        return (string)$response->getBody();
    }

    /**
     * @param string $url
     * @param array $options "width", "height", "selector"
     *
     * @return string
     * @throws Exception
     */
    public function htmlURL($url, array $options = [])
    {
        try {
            $guzzle   = new Client();
            $response = $guzzle->post(sprintf('%s/html', $this->puppetUrl), [
                RequestOptions::JSON => [
                    'url'     => $url,
                    'options' => $options
                ]
            ]);
        } catch (Exception $e) {
            throw $e;
        }

        return (string)$response->getBody();
    }

    /**
     * @see https://pptr.dev/#?product=Puppeteer&version=v1.19.0&show=api-pagepdfoptions
     *
     * @param string $html
     * @param array $options
     *
     * @return string
     * @throws Exception
     */
    public function pdf($html, array $options = [])
    {
        try {
            $guzzle   = new Client();
            $response = $guzzle->post(sprintf('%s/pdf', $this->puppetUrl), [
                RequestOptions::JSON => [
                    'html'    => $html,
                    'options' => $options
                ]
            ]);
        } catch (Exception $e) {
            throw $e;
        }

        return (string)$response->getBody();
    }
}
