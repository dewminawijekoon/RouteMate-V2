// Backend API URL - Loaded from environment variables
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3001';

class GeminiService {
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${BACKEND_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get response from AI assistant');
      }

      return data.response;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  async sendMessageWithContext(message: string, context: string = ''): Promise<string> {
    try {
      const response = await fetch(`${BACKEND_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get response from AI assistant');
      }

      return data.response;
    } catch (error) {
      console.error('Error sending message with context to backend:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  // Method to send message with RouteMate context (uses dedicated endpoint)
  async sendRouteMateMessage(message: string): Promise<string> {
    try {
      console.log('Sending message to backend:', message);
      console.log('Backend URL:', `${BACKEND_URL}/chatbot/routemate`);
      
      const response = await fetch(`${BACKEND_URL}/chatbot/routemate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get response from AI assistant');
      }

      return data.response;
    } catch (error) {
      console.error('Error sending RouteMate message to backend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      throw new Error(`Failed to get response from AI assistant: ${errorMessage}`);
    }
  }
}

export default new GeminiService();