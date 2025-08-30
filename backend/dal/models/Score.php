<?php

class Score 
{
    private int $id;
    private string $pseudo;
    private float $wpm;
    private float $accuracy;
    private float $raw;
    private float $consistency; 
    private ?DateTime $createdAt;

    public function __construct(
        int $id = 0,
        string $pseudo,
        float $wpm, 
        float $accuracy, 
        float $raw, 
        float $consistency, 
        ?DateTime $createdAt
    )
    {
       $this->setId($id); 
       $this->setPseudo($pseudo); 
       $this->setWPM($wpm); 
       $this->setAccuracy($accuracy); 
       $this->setRAW($raw); 
       $this->setConsistency($consistency); 
       $this->setCreatedAt($createdAt); 
    }

    public function getId(): int 
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }
    
    public function getPseudo(): string 
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $pseudo = trim($pseudo);
        if (empty($pseudo) || strlen($pseudo) > 50 || !ctype_alnum($pseudo))
            throw new Exception("Le pseudo '$pseudo' doit être entre 1 et 50 caractères contenir uniquement des caractères alphanumériques.");
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getWPM(): float 
    {
        return $this->wpm;
    }

    public function setWPM(float $wpm): self 
    {
        $this->wpm = $wpm;
        return $this;
    }

    public function getRAW(): float
    {
        return $this->raw;
    }
    
    public function setRAW(float $raw): self 
    {
        $this->raw = $raw;
        return $this;
    }

    public function getAccuracy(): float 
    {
        return $this->accuracy;
    }

    public function setAccuracy(float $accuracy): self 
    {
        $this->accuracy = $accuracy;
        return $this;
    }

    public function getConsistency(): float 
    {
        return $this->consistency;
    }
    
    public function setConsistency(float $consistency): self 
    {
        $this->consistency = $consistency;
        return $this;
    }

    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTime $createdAt): self
    {
        $this->createdAt = $createdAt ?? new DateTime();
        return $this;
    }
}