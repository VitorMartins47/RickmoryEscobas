import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function MediaCard() {
    const [getCharacters, setCharacters] = useState([]);

    const [episodeNames, setEpisodeNames] = useState({});

    async function getFirstSeenName(url) {
        if (typeof url !== 'string') {
            return null;
        }

        try {
            const response = await axios.get(url);
            const name = response.data.name;
            return name
        } catch (error) {
            console.error("Erro ao buscar dados adicionais:", error);
            return null
        }
    }

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const response = await axios.get("https://rickandmortyapi.com/api/character");
                const charactersList = response.data.results;
                setCharacters(charactersList);
                charactersList.forEach(async (character) => {
                    if (character.episode.length > 0) {
                        const name = await getFirstSeenName(character.episode[0]);
                        setEpisodeNames(prevNames => ({
                            ...prevNames,
                            [character.id]: name
                        }));
                    }
                });
            } catch (error) {
                console.error("Erro ao buscar personagens:", error);
            }
        }

        fetchCharacters();
    }, []);

    return (
        <div>
            {getCharacters.map((character, index) => (
                <Card key={index} sx={{ maxWidth: 345, margin: 2 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={character.image}
                        title={character.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {character.name}
                        </Typography>
                        <Typography variant="body2">
                            {character.status} - {character.species}
                        </Typography>

                        <br />

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Last known location:
                        </Typography>
                        <Typography variant="body2">
                            {character.location.name}
                        </Typography>

                        <br />

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            First seen in:
                        </Typography>
                        <Typography variant="body2">
                            {episodeNames[character.id] || 'Loading...'}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

}