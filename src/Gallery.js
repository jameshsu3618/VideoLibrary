import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createVideo } from './graphql/mutations'
import { listVideos } from './graphql/queries'
import { Storage } from 'aws-amplify';
import Videotable from './Videotable'


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
    //   <div style={styles.container}>
    //     <h2 style={{textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem'}}>
    //       Video Library
    //     </h2>
    //     <Card style={{textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#dacccc'}}>
    //       <h3>
    //         Video Upload
    //       </h3>
    //       <input 
    //         type="file"
    //         onChange={event => upload(event)}
    //         style={{margin: 'auto', paddingLeft: '6rem'}}
    //       />
    //     </Card>
    //     <Card bg='Secondary' style={{marginTop: '2rem', backgroundColor: '#dacccc'}}>
    //       <div class="row" style={{paddingTop: '2rem'}}>
    //         {videos.map((video, index) => (
    //           <div class="col-md-4">
    //             <Card style={{ width: '18rem', margin: 'auto', height: '32rem', marginBottom: '2rem'}}>
    //               <Card.Body>
    //               {(video.type == "youtube") ? (
    //                 <ReactPlayer  width='16rem' height='16rem' url={video.content} />
    //               ) : (
    //                 <video
    //                 id="my-video"
    //                 className="video-js"
    //                 controls
    //                 preload="auto"
    //                 width="16rem"
    //                 height="16rem"
    //                 data-setup="{}"
    //                 >
    //                   <source src={video.content} type='video/mp4' />
    //                 ></video>
    //               )}
    //               </Card.Body>            
    //               <Card.Body>
    //                 <Card.Text><a>{video.name}</a></Card.Text>
    //                 <Button variant="primary" onClick={() => addVideo(video.content, video.name, "youtube")}>Add Video</Button>
    //               </Card.Body>
    //             </Card>
    //           </div> 
    //         ))}
    //       </div>
    //     </Card>
    //   </div>
    // )
}
  const styles = {
    container: { margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
    video: {  marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
    videoName: { fontSize: 20, fontWeight: 'bold' },
    videoContent: { marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
  }
  

export default Gallery