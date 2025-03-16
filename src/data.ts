// Sample data for diagram components
import { TCPIPLayerInfo, ProtocolFeature, PageNode, PageConnection, WorkflowStep, ClassFields } from './types';

// TCP/IP Model Data
export const tcpipLayers: TCPIPLayerInfo[] = [
  {
    name: 'Application',
    description: 'Provides network services to applications and handles data representation.',
    protocols: ['HTTP', 'FTP', 'SMTP', 'DNS', 'DHCP'],
    responsibilities: ['User interface', 'Data representation', 'Session management']
  },
  {
    name: 'Transport',
    description: 'Provides end-to-end communication and data flow control between devices.',
    protocols: ['TCP', 'UDP', 'SCTP'],
    responsibilities: ['End-to-end communication', 'Flow control', 'Error recovery']
  },
  {
    name: 'Internet',
    description: 'Handles packet routing and addressing between networks.',
    protocols: ['IP', 'ICMP', 'ARP', 'IGMP'],
    responsibilities: ['Logical addressing', 'Routing', 'Path determination']
  },
  {
    name: 'Network Interface',
    description: 'Handles physical connection and data transmission over the network medium.',
    protocols: ['Ethernet', 'Wi-Fi', 'PPP', 'Token Ring'],
    responsibilities: ['Physical addressing', 'Media access control', 'Signal transmission']
  }
];

// TCP vs UDP Comparison Data
export const protocolFeatures: ProtocolFeature[] = [
  {
    feature: 'Connection Type',
    tcpValue: 'Connection-oriented',
    udpValue: 'Connectionless',
    description: 'TCP requires a connection to be established before data transfer, UDP does not.'
  },
  {
    feature: 'Reliability',
    tcpValue: 5,
    udpValue: 2,
    description: 'TCP guarantees delivery of data packets, UDP does not guarantee delivery.'
  },
  {
    feature: 'Speed',
    tcpValue: 3,
    udpValue: 5,
    description: 'UDP is faster due to no connection setup and minimal error checking.'
  },
  {
    feature: 'Header Size',
    tcpValue: '20-60 bytes',
    udpValue: '8 bytes',
    description: 'TCP has a larger header size due to more control information.'
  },
  {
    feature: 'Data Flow Control',
    tcpValue: 'Yes',
    udpValue: 'No',
    description: 'TCP manages data flow to prevent network congestion, UDP does not.'
  },
  {
    feature: 'Use Cases',
    tcpValue: 'Web, Email, File Transfer',
    udpValue: 'Video Streaming, DNS, VoIP',
    description: 'TCP is used for applications requiring reliability, UDP for speed-sensitive applications.'
  }
];

// Site Map Data
export const pageNodes: PageNode[] = [
  {
    id: 'home',
    type: 'home',
    data: {
      label: 'Home Page',
      description: 'Main landing page for the movie recommendation system',
      functionality: ['Featured movies', 'Search bar', 'User login/signup']
    },
    position: { x: 250, y: 0 }
  },
  {
    id: 'detail',
    type: 'detail',
    data: {
      label: 'Movie Detail',
      description: 'Detailed view of a selected movie',
      functionality: ['Movie information', 'Cast details', 'User reviews', 'Similar movies']
    },
    position: { x: 250, y: 150 }
  },
  {
    id: 'ranking',
    type: 'ranking',
    data: {
      label: 'Movie Rankings',
      description: 'View of top-rated movies by category',
      functionality: ['Filter by genre', 'Sort by rating', 'User voting']
    },
    position: { x: 500, y: 150 }
  },
  {
    id: 'login',
    type: 'login',
    data: {
      label: 'User Login',
      description: 'User authentication page',
      functionality: ['Login form', 'Password recovery', 'New user registration']
    },
    position: { x: 0, y: 150 }
  },
  {
    id: 'service',
    type: 'service',
    data: {
      label: 'API Services',
      description: 'Backend services for the recommendation system',
      functionality: ['Movie data API', 'User data API', 'Recommendation algorithm']
    },
    position: { x: 250, y: 300 }
  }
];

export const pageConnections: PageConnection[] = [
  {
    id: 'home-detail',
    source: 'home',
    target: 'detail',
    label: 'View Movie',
    type: 'GET'
  },
  {
    id: 'home-ranking',
    source: 'home',
    target: 'ranking',
    label: 'View Rankings',
    type: 'GET'
  },
  {
    id: 'home-login',
    source: 'home',
    target: 'login',
    label: 'Login/Signup',
    type: 'GET'
  },
  {
    id: 'detail-service',
    source: 'detail',
    target: 'service',
    label: 'Fetch Movie Data',
    type: 'GET'
  },
  {
    id: 'ranking-service',
    source: 'ranking',
    target: 'service',
    label: 'Fetch Rankings',
    type: 'GET'
  },
  {
    id: 'login-service',
    source: 'login',
    target: 'service',
    label: 'Authenticate User',
    type: 'POST'
  }
];

// Server-Side Logic Activity Diagram Data
export const workflowSteps: WorkflowStep[] = [
  {
    id: 'start',
    type: 'start',
    label: 'User Requests Movie',
    description: 'User initiates a request for movie recommendations',
    nextSteps: ['check-auth']
  },
  {
    id: 'check-auth',
    type: 'decision',
    label: 'Check Authentication',
    description: 'Verify if user is authenticated',
    nextSteps: ['fetch-preferences', 'request-login'],
    condition: 'Is user authenticated?'
  },
  {
    id: 'request-login',
    type: 'process',
    label: 'Request Login',
    description: 'Redirect user to login page',
    nextSteps: ['end-no-auth']
  },
  {
    id: 'end-no-auth',
    type: 'end',
    label: 'End - No Auth',
    description: 'Process ends due to no authentication'
  },
  {
    id: 'fetch-preferences',
    type: 'process',
    label: 'Fetch User Preferences',
    description: 'Retrieve user preferences from database',
    nextSteps: ['fetch-movie-data']
  },
  {
    id: 'fetch-movie-data',
    type: 'data',
    label: 'Fetch Movie Data',
    description: 'Retrieve movie data from database or external API',
    nextSteps: ['apply-algorithm']
  },
  {
    id: 'apply-algorithm',
    type: 'process',
    label: 'Apply Recommendation Algorithm',
    description: 'Process data through recommendation algorithm',
    nextSteps: ['return-results']
  },
  {
    id: 'return-results',
    type: 'process',
    label: 'Return Results',
    description: 'Send recommendation results to client',
    nextSteps: ['end-success']
  },
  {
    id: 'end-success',
    type: 'end',
    label: 'End - Success',
    description: 'Process completes successfully'
  }
];

// Class Data Visualization
export const classFields: ClassFields = {
  Actor: [
    {
      name: 'actorId',
      dataType: 'number',
      description: 'Unique identifier for the actor',
      examples: ['1', '2', '3']
    },
    {
      name: 'name',
      dataType: 'string',
      description: 'Full name of the actor',
      examples: ['Tom Hanks', 'Meryl Streep']
    },
    {
      name: 'birthDate',
      dataType: 'Date',
      description: 'Date of birth of the actor',
      examples: ['1956-07-09', '1949-06-22']
    },
    {
      name: 'biography',
      dataType: 'string',
      description: 'Brief biography of the actor',
      examples: ['Award-winning actor known for...', 'Versatile actress with...']
    },
    {
      name: 'movies',
      dataType: 'Movie[]',
      description: 'List of movies the actor has appeared in',
      examples: ['[Movie1, Movie2]', '[Movie3, Movie4, Movie5]']
    }
  ],
  Movie: [
    {
      name: 'movieId',
      dataType: 'number',
      description: 'Unique identifier for the movie',
      examples: ['101', '102']
    },
    {
      name: 'title',
      dataType: 'string',
      description: 'Title of the movie',
      examples: ['The Shawshank Redemption', 'Inception']
    },
    {
      name: 'releaseDate',
      dataType: 'Date',
      description: 'Date when the movie was released',
      examples: ['1994-09-23', '2010-07-16']
    },
    {
      name: 'genre',
      dataType: 'string[]',
      description: 'Genres the movie belongs to',
      examples: ["['Drama']", "['Sci-Fi', 'Action']"]
    },
    {
      name: 'director',
      dataType: 'string',
      description: 'Director of the movie',
      examples: ['Frank Darabont', 'Christopher Nolan']
    },
    {
      name: 'cast',
      dataType: 'Actor[]',
      description: 'List of actors in the movie',
      examples: ['[Actor1, Actor2]', '[Actor3, Actor4, Actor5]']
    },
    {
      name: 'rating',
      dataType: 'number',
      description: 'Average rating of the movie',
      examples: ['9.3', '8.8']
    },
    {
      name: 'reviews',
      dataType: 'UserReview[]',
      description: 'User reviews of the movie',
      examples: ['[Review1, Review2]', '[Review3, Review4]']
    }
  ],
  User: [
    {
      name: 'userId',
      dataType: 'number',
      description: 'Unique identifier for the user',
      examples: ['1001', '1002']
    },
    {
      name: 'username',
      dataType: 'string',
      description: 'Username for login',
      examples: ['moviefan123', 'cinephile456']
    },
    {
      name: 'email',
      dataType: 'string',
      description: 'Email address of the user',
      examples: ['user@example.com', 'another@example.com']
    },
    {
      name: 'preferences',
      dataType: 'object',
      description: 'User preferences for recommendations',
      examples: ['{favoriteGenres: ["Drama", "Comedy"]}', '{favoriteActors: ["Tom Hanks"]}']
    },
    {
      name: 'watchHistory',
      dataType: 'Movie[]',
      description: 'Movies the user has watched',
      examples: ['[Movie1, Movie2]', '[Movie3, Movie4]']
    },
    {
      name: 'reviews',
      dataType: 'UserReview[]',
      description: 'Reviews written by the user',
      examples: ['[Review1, Review2]', '[Review3]']
    }
  ],
  UserReview: [
    {
      name: 'reviewId',
      dataType: 'number',
      description: 'Unique identifier for the review',
      examples: ['5001', '5002']
    },
    {
      name: 'userId',
      dataType: 'number',
      description: 'ID of the user who wrote the review',
      examples: ['1001', '1002']
    },
    {
      name: 'movieId',
      dataType: 'number',
      description: 'ID of the movie being reviewed',
      examples: ['101', '102']
    },
    {
      name: 'rating',
      dataType: 'number',
      description: 'Rating given by the user (1-10)',
      examples: ['8', '9']
    },
    {
      name: 'comment',
      dataType: 'string',
      description: 'Text of the review',
      examples: ['Great movie with excellent acting!', 'Disappointing plot but good visuals.']
    },
    {
      name: 'date',
      dataType: 'Date',
      description: 'Date when the review was written',
      examples: ['2023-05-15', '2023-06-22']
    }
  ],
  ExternalReview: [
    {
      name: 'reviewId',
      dataType: 'number',
      description: 'Unique identifier for the external review',
      examples: ['7001', '7002']
    },
    {
      name: 'source',
      dataType: 'string',
      description: 'Source of the external review',
      examples: ['Rotten Tomatoes', 'IMDb']
    },
    {
      name: 'movieId',
      dataType: 'number',
      description: 'ID of the movie being reviewed',
      examples: ['101', '102']
    },
    {
      name: 'criticName',
      dataType: 'string',
      description: 'Name of the critic who wrote the review',
      examples: ['Roger Ebert', 'Peter Travers']
    },
    {
      name: 'rating',
      dataType: 'number',
      description: 'Rating given by the critic',
      examples: ['4.5', '3.0']
    },
    {
      name: 'content',
      dataType: 'string',
      description: 'Full text of the review',
      examples: ['A masterpiece of modern cinema...', 'Falls short of expectations...']
    },
    {
      name: 'publicationDate',
      dataType: 'Date',
      description: 'Date when the review was published',
      examples: ['2023-04-10', '2023-05-22']
    },
    {
      name: 'url',
      dataType: 'string',
      description: 'URL to the original review',
      examples: ['https://example.com/reviews/12345', 'https://critic-site.com/movie-review']
    }
  ],
  RecommendationEngine: [
    {
      name: 'engineId',
      dataType: 'number',
      description: 'Unique identifier for the recommendation engine',
      examples: ['1', '2']
    },
    {
      name: 'algorithm',
      dataType: 'string',
      description: 'Algorithm used for recommendations',
      examples: ['Collaborative Filtering', 'Content-Based']
    },
    {
      name: 'parameters',
      dataType: 'object',
      description: 'Parameters for the recommendation algorithm',
      examples: ['{weightFactor: 0.8, recencyBoost: 0.5}', '{similarityThreshold: 0.7}']
    },
    {
      name: 'getRecommendations',
      dataType: 'function',
      description: 'Function to generate recommendations for a user',
      examples: ['(userId) => Movie[]', '(preferences) => Movie[]']
    },
    {
      name: 'accuracy',
      dataType: 'number',
      description: 'Measured accuracy of recommendations',
      examples: ['0.85', '0.92']
    }
  ]
};