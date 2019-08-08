<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190808221006 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE project ADD screenshot_id INT UNSIGNED DEFAULT NULL, DROP screenshot');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE4A8B36A0 FOREIGN KEY (screenshot_id) REFERENCES media (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2FB3D0EE4A8B36A0 ON project (screenshot_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE4A8B36A0');
        $this->addSql('DROP INDEX UNIQ_2FB3D0EE4A8B36A0 ON project');
        $this->addSql('ALTER TABLE project ADD screenshot VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, DROP screenshot_id');
    }
}
