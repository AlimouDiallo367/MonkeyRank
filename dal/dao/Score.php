<?php

class ScoreDao extends BaseDao
{
    public function __construct(ConfigDao $config)
    {
        parent::__construct($config);
    }

    /**
     * Insère un nouveau score.
     */
    public function insert(Score $score): bool
    {
        $connection = $this->getConnection();

        $sql = "INSERT INTO scores (pseudo, wpm, accuracy, raw, consistency, created_at)
                VALUES (:pseudo, :wpm, :accuracy, :raw, :consistency, :created_at)";

        $query = $connection->prepare($sql);

        return $query->execute([
            ':pseudo' => $score->getPseudo(),
            ':wpm' => $score->getWPM(),
            ':accuracy' => $score->getAccuracy(),
            ':raw' => $score->getRAW(),
            ':consistency' => $score->getConsistency(),
            ':created_at' => $score->getCreatedAt()
                ? $score->getCreatedAt()->format('Y-m-d H:i:s')
                : (new DateTime())->format('Y-m-d H:i:s')
        ]);
    }

    /**
     * Récupère les X meilleurs scores.
     */
    public function getTopScores(int $limit = 50): array
    {
        $connection = $this->getConnection();

        $sql = "SELECT * FROM scores ORDER BY wpm DESC, accuracy DESC LIMIT :limit";
        $query = $connection->prepare($sql);
        $query->bindValue(':limit', $limit, PDO::PARAM_INT);
        $query->execute();

        $scores = [];
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $scores[] = $this->hydrateScore($row);
        }

        return $scores;
    }

    /**
     * Récupère tous les scores (ordre chronologique inverse).
     */
    public function getAllScores(): array
    {
        $connection = $this->getConnection();

        $sql = "SELECT * FROM scores ORDER BY created_at DESC";
        $query = $connection->prepare($sql);
        $query->execute();

        $scores = [];
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $scores[] = $this->hydrateScore($row);
        }

        return $scores;
    }

    /**
     * Récupère les scores d'un joueur spécifique.
     */
    public function getScoresByPseudo(string $pseudo): array
    {
        $connection = $this->getConnection();

        $sql = "SELECT * FROM scores WHERE pseudo = :pseudo ORDER BY wpm DESC";
        $query = $connection->prepare($sql);
        $query->execute([':pseudo' => $pseudo]);

        $scores = [];
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $scores[] = $this->hydrateScore($row);
        }

        return $scores;
    }

    /**
     * Supprime tous les scores (reset du leaderboard).
     */
    public function deleteAll(): bool
    {
        $connection = $this->getConnection();

        $sql = "DELETE FROM scores";
        $query = $connection->prepare($sql);

        return $query->execute();
    }

    /**
     * Convertit une ligne SQL en objet Score.
     */
    private function hydrateScore(array $row): Score
    {
        return new Score(
            (int)$row['id'],
            $row['pseudo'],
            (float)$row['wpm'],
            (float)$row['accuracy'],
            (float)$row['raw'],
            (float)$row['consistency'],
            new DateTime($row['created_at'])
        );
    }
}
