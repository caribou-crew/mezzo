import { Container, Typography, IconButton, Box, Paper } from '@mui/material';
import { CopyAll } from '@mui/icons-material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import github from 'react-syntax-highlighter/dist/cjs/styles/hljs/github';
import { toast } from 'react-toastify';

const SaveAsRemote = ({ saveAsRemote }: { saveAsRemote: string }) => {
  if (saveAsRemote.length === 0) {
    return null;
  }
  return (
    <Paper sx={{ backgroundColor: '#FFFFFF', pt: 1, pb: 1, mb: 1 }}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{ pl: 0 }}
            onClick={() => {
              navigator.clipboard.writeText(saveAsRemote);
              toast.success('Copied');
            }}
            color="primary"
          >
            <CopyAll />
          </IconButton>
          <Typography variant="body1">
            Copy the following code snippet to where you initialize the mezzo
            server
          </Typography>
        </Box>
        <SyntaxHighlighter
          language="javascript"
          style={github}
          customStyle={{
            padding: 0,
            margin: 0,
            backgroundColor: '#FFFFFF',
          }}
          wrapLongLines={true}
        >
          {saveAsRemote}
        </SyntaxHighlighter>
      </Container>
    </Paper>
  );
};

export default SaveAsRemote;
