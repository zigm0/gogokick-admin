<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190818114835 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE block ADD media_id INT UNSIGNED DEFAULT NULL, DROP media');
        $this->addSql('ALTER TABLE block ADD CONSTRAINT FK_831B9722EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_831B9722EA9FDD75 ON block (media_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE block DROP FOREIGN KEY FK_831B9722EA9FDD75');
        $this->addSql('DROP INDEX UNIQ_831B9722EA9FDD75 ON block');
        $this->addSql('ALTER TABLE block ADD media VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, DROP media_id');
    }
}
