<?php
namespace App\Media;

use closure;

/**
 * Interface CDNInterface
 */
interface CDNInterface
{
    /**
     * Uploads the data to the CDN and returns the URL
     *
     * @param string $system
     * @param string $path
     * @param string $data
     * @param array  $headers
     *
     * @return string
     */
    public function upload($system, $path, $data, $headers = []);

    /**
     * Returns the contents of the file at the given path
     *
     * @param string $system
     * @param string $path
     *
     * @return string
     */
    public function download($system, $path);

    /**
     * Deletes the file at the given path
     *
     * @param string $system
     * @param string $path
     *
     * @return bool
     */
    public function remove($system, $path);

    /**
     * @param string $url
     *
     * @return bool
     */
    public function removeByURL($url);

    /**
     * Invalidate the cache for the given path
     *
     * @param string $system
     * @param string $path
     *
     * @return bool
     */
    public function invalidate($system, $path);

    /**
     * Returns the URL for the given path
     *
     * When $verify is true the method throws an exception if the file
     * does not exist in S3.
     *
     * @param string $system
     * @param string $path
     * @param bool   $verify
     *
     * @return string
     */
    public function resolveUrl($system, $path, $verify = false);
}
