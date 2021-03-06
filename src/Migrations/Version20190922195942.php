<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190922195942 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE note (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED DEFAULT NULL, block_id INT UNSIGNED DEFAULT NULL, text LONGTEXT NOT NULL, date_created DATETIME NOT NULL, INDEX IDX_CFBDFA14A76ED395 (user_id), INDEX IDX_CFBDFA14E9ED820C (block_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14E9ED820C FOREIGN KEY (block_id) REFERENCES block (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE activity ADD note_id INT UNSIGNED DEFAULT NULL');
        $this->addSql('ALTER TABLE activity ADD CONSTRAINT FK_AC74095A26ED0855 FOREIGN KEY (note_id) REFERENCES note (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_AC74095A26ED0855 ON activity (note_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE activity DROP FOREIGN KEY FK_AC74095A26ED0855');
        $this->addSql('DROP TABLE note');
        $this->addSql('DROP INDEX IDX_AC74095A26ED0855 ON activity');
        $this->addSql('ALTER TABLE activity DROP note_id');
    }
}
