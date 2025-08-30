<?php

/**
 * Classe abstraite parent pour tous les DAO liés à une BD.
 * Un DAO se spécialise dans les opérations sur une table.
 */

abstract class BaseDao
{
    private ConfigDao $config;
    private ?PDO $connection;

    public function __construct(ConfigDao $config)
    {
       $this->config = $config;
       $this->connection = null; 
    }

    /**
     * Retourne la connexion à la BD du DAO. L'appelant n'a pas à fermer la connexion.
     * 
     * @return PDO La connexion à la BD.
     * @throws PDOException S'il y a une erreur de connexion. 
     */

    protected function getConnection(): PDO
    {
        if ($this->connection === null)
        {
           $this->connection = new PDO(
                $this->config->createConnectionString(),
                $this->config->getUsername(),
                $this->config->getPassword(),
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::MYSQL_ATTR_FOUND_ROWS => true
                )
            );
        }

        return $this->connection;
    }

    protected function getConfig(): ConfigDao
    {
        return $this->config;
    }

    /**
     * Destructeur. Ferme la connexion à la BD.
     */

    function __destruct()
    {
        $this->connection = null;
    }
}