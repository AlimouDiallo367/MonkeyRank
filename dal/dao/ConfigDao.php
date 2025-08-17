<?php

class ConfigDao 
{
    private string $dbName;
    private string $username;
    private string $password;
    private string $hostAddress;
    private int $port;
    private string $encoding;
    private string $engine;
    
    public function __construct(
        string $dbName,
        string $username,
        string $password, 
        string $hostAddress = 'localhost', 
        int $port = 3306,
        string $encoding = 'utf8mb4', 
        string $engine = 'mysql'
    ){
        $this->dbName = $dbName;
        $this->username = $username;
        $this->password = $password;
        $this->hostAddress = $hostAddress;
        $this->port = $port;
        $this->encoding = $encoding;
        $this->engine = $engine;
    } 
    
    public function createConnectionString(): string 
    {
        return "$this->engine:dbname=$this->dbName;host=$this->hostAddress;port=$this->port;charset=$this->encoding;";
    }
    
    public function getUsername(): string 
    {
        return $this->username;
    }

    public function getPassword(): string 
    {
        return $this->password;
    }
}