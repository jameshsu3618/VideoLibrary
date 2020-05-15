import React from 'react'
import Table from './Table'
import styled from 'styled-components'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const Videotable = ({videos}) => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Thumbnail',
                accessor: 'image',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Uploaded',
                accessor: 'createdAt',
            },
            {
                Header: 'Updated',
                accessor: 'updatedAt',
            }
        ],
        []
      )
    
    function parseTable(){
        let videoTables = [];
        videos.forEach(
            video => {
                let parsedVideo = {}
                parsedVideo.id = video.id
                parsedVideo.type = video.type
                parsedVideo.content = video.content
                parsedVideo.name = video.name
                parsedVideo.createdAt = parseCreatedAt(video.createdAt)
                parsedVideo.updatedAt =  parseUpdated(video.updatedAt)
                videoTables.push(parsedVideo)
            }
        )
        return videoTables
    }

    function parseCreatedAt(timeString){
        let date = new Date(timeString)
        let dateArray = date.toDateString().split(' ')
        return `${dateArray[2]} ${dateArray[1]}, ${dateArray[3]}`
    }

    function parseUpdated(timeString){
        let updatedDate = new Date(timeString)
        let todayDate = new Date()
        let millisecondDiff = todayDate - updatedDate
        return `${Math.floor(millisecondDiff /(60000 * 60))} hour(s) ago`
    }

    const data = React.useMemo(() => parseTable(), [])

    return (
        <Styles>
          <Table columns={columns} data={data} />
        </Styles>
      )
}
export default Videotable