'use client'

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm Spotify's support assistant. How can I help you today?`
    },
  ]);
 
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    
    setMessage('');

    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      sx={{ 
        backgroundImage:`url('https://st5.depositphotos.com/1241729/64438/i/450/depositphotos_644384862-stock-photo-berlin-germany-june-2021-spotify.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }} 
    >
      <Typography variant='h2' color={'white'} sx={{ mb: 3, fontWeight: 'bold' }}>
        Spotify's Customer Service
      </Typography>
      <Stack
        direction={'column'}
        width="500px"
        height="600px"
        borderRadius="16px"
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.3)"
        bgcolor={'#f0f0f0'}
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            padding: '10px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  backgroundColor: message.role === 'assistant' ? '#4caf50' : '#2196f3',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: '8px' }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
