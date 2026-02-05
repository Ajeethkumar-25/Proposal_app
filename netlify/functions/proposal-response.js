exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { response } = JSON.parse(event.body);
    
    if (!response) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing response field' })
      };
    }

    // Log the proposal response
    console.log(`Proposal response received: ${response} at ${new Date().toISOString()}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        message: 'Proposal response recorded!',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error handling proposal response:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Error processing response'
      })
    };
  }
};
