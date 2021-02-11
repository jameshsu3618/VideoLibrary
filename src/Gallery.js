import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createVideo } from './graphql/mutations'
import { listVideos } from './graphql/queries'
import { Storage } from 'aws-amplify';
import Videotable from './Videotable'
import { withAuthenticator } from '@aws-amplify/ui-react';

const Gallery = () => {
    const [videos, setVideos] = useState([])
  
    useEffect(() => {
      fetchVideos()
    }, [])

    async function fetchVideos() {
      try {
        const videoData = await API.graphql(graphqlOperation(listVideos))
        const videos = videoData.data.listVideos.items
        setVideos(videos)
      } catch (err) { console.log('error fetching videos') }
    }
  
    return (
      <div>
        {(videos.length > 0) ? (
          <Videotable videos={videos}>
          </Videotable>
        ) : (
          <div>
          </div>
        )}
      </div>
    )
  }
  const styles = {
    container: { margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
    video: {  marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
    videoName: { fontSize: 20, fontWeight: 'bold' },
    videoContent: { marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
  }
  

export default withAuthenticator(Gallery)