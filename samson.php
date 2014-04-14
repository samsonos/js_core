<?php
namespace samson\js\core;

/**
 * Интерфейс для подключения модуля в ядро фреймворка SamsonPHP
 *
 * @package SamsonPHP
 * @author Vitaly Iegorov <vitalyiegorov@gmail.com>
 * @author Nikita Kotenko <nick.w2r@gmail.com>
 * @version 0.1
 */
class SamsonJSConnector extends \samson\core\CompressableExternalModule
{
	protected $id = 'samsonjs';
}