/* src/App.js */
import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createVideo } from './graphql/mutations'
import { listVideos } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Storage } from 'aws-amplify';
import ReactPlayer from 'react-player';
import awsconfig from "./s3-exports";
import youtube from "./api/youtube"
import {Card,Button } from 'react-bootstrap'

const initialState = {term: 'Default text'}
const App = () => {
  const [ytVideos, setYtVideos] = useState([])
  const [searchParam, setSearchParam] = useState(initialState)
  function handleChange(e){
      setSearchParam({
          term: e.target.value
      })
  };
  useEffect(() => {
    searchYoutube()
  }, [])

  const ytLink = 'https://www.youtube.com/watch?v='



  function upload(e){
    let file = e.target.files[0]

    Storage.put(file.name, file, {
      contentType: 'video/mp4'
    })
    .then (result => saveVideo(file))
    .catch(err => console.log(err));
  }

  function parseYoutubeVideos(videoList = []){
    let parsedList = []
    videoList.forEach((video) =>{
      let parsedVideo = { name: '', content: '' }
      parsedVideo.name = video.snippet.title.replace(/&amp;/g, '&').replace(/&#39;/g, "'")
      parsedVideo.content = `${ytLink}${video.id.videoId}`
      parsedList = [...parsedList, parsedVideo]
    })
    setYtVideos(parsedList)
  }

  function saveVideo(file){
    Storage.get(file.name)
    .then(result => 
        addVideo(result, file.name)
      )
    .catch(err => console.log(err));
  }


  async function searchYoutube(params = 'hip-hop') {
    try {
    const response = await youtube.get('/search', {
      params: {
        q: params,
        part: 'snippet',
        type: 'video',
        maxResults: 15,
        key: 'AIzaSyADbtCSQdneAlFJaKB-YSBQmU7MNdtGyDs'
      }
    })
    const ytVideos = response.data.items

    parseYoutubeVideos(ytVideos)
    } catch (err) { console.log('error fetching youtube videos')}
  }



  async function addVideo(content = "", name = "", type="None") {
    try {
      const video = {content, name, type }
      if (type!=="youtube") video.content = `${awsconfig.cloudfront}${name}`
      await API.graphql(graphqlOperation(createVideo, {input: video}))
    } catch (err) {
      console.log('error creating video:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={{textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem'}}>
        Video Library
      </h2>
      <Card style={{textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#dacccc'}}>
        <h3>
          Video Upload
        </h3>
        <input 
          type="file"
          onChange={event => upload(event)}
          style={{margin: 'auto', paddingLeft: '6rem'}}
        />
      </Card>
      <Card bg='Secondary' style={{marginTop: '2rem', backgroundColor: '#dacccc'}}>
        <form >
          <div style={{margin: 'auto', width: '20rem', padding: '1rem'}}>
            <label >
              Search Youtube here:
            </label>
            <input onChange={handleChange} defaultValue={'hip-hop'}>
            </input>
          </div>
        </form>
        <div class="row">
          {ytVideos.map((video, index) => (
            <div class="col-md-4">
              <Card style={{ width: '18rem', margin: 'auto', height: '32rem', marginBottom: '2rem'}}>
                <Card.Body>
                  <ReactPlayer width='16rem' height='16rem' url={video.content} />
                </Card.Body>            
                <Card.Body>
                  <Card.Text><a>{video.name}</a></Card.Text>
                  <Button variant="primary" onClick={() => addVideo(video.content, video.name, "youtube")}>Add Video</Button>
                </Card.Body>
              </Card>
            </div> 
          ))}
        </div>
      </Card>
    </div>
  )
}

const styles = {
  container: {margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  video: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  videoName: { fontSize: 20, fontWeight: 'bold' },
  videoContent: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App