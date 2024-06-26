import { useContext, useEffect, useState } from "react"
import { PLAYLIST_EXAMPLES } from "@AppConstants"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PlaylistProps } from "../../../../vite-env"
import ArtistIcon from "../../../../assets/Artist"
import AlbumIcon from "../../../../assets/Album"
import { formatTime, getDominantColor } from "@helpers"
import { PlayerContext, QueueContext } from "@context"

// Styles
import "./index.css"
import { usePathTool, usePlayer, useQueue } from "@hooks"

export default function PlaylistPage() {

    const { QueueState } = useContext(QueueContext);
    const { PlayerState } = useContext(PlayerContext);

    const { ChangePlaylistData, ChangePlaylistID } = useQueue()
    const { ChangePlayerData, PlayPlayer } = usePlayer()
    const { Include } = usePathTool()
    const navigate = useNavigate()

    const { playlist } = useParams<{ playlist: string }>()

    const [Data, setData] = useState<PlaylistProps>()
    const [DominantColor, setDominantColor] = useState<string>()

    useEffect(() => {
        getDominantColor(Data?.imageURL!, 30)
            .then(value => setDominantColor(value))

        const data = PLAYLIST_EXAMPLES[
            PLAYLIST_EXAMPLES.findIndex(({ Id }) => Id === playlist)
        ]
        if (data.Title.length !== 0) {
            setData(data)
        } else {
            navigate("/")
        }
    }, [Data?.imageURL])

    const handlePlayerSong = (index: number) => {
        ChangePlayerData({ ...Data?.Songs[index]! })
        ChangePlaylistID(Data?.Id!)
        ChangePlaylistData([...Data?.Songs!].splice(index, Data?.Songs?.length))
        PlayPlayer()
    }

    console.log(`/${QueueState.PlaylistID}`);

    return (
        <div id="Playlist" style={{
            background: `linear-gradient(${DominantColor} 50%, var(--BgMain) 100%)`
        }}>
            <div id="Playlist-Content">
                <div id="Playlist-Content-Details">
                    <h1 id="Playlist-Content-Details-Name">{Data?.Title}</h1>
                    {/* <p id="Playlist-Content-Details-Description">{Data?.Description}</p> */}
                    <div id="Playlist-Content-SongDetails-Description">
                        <Link to={Data?.Artist[0]?.URL!}>
                            <ArtistIcon />
                            <span className="Playlist-Content-SongDetails-Description-Text">{Data?.Artist[0]?.Name}
                            </span>
                        </Link>
                        <span className="Playlist-Content-SongDetails-Description-Separators">
                            •
                        </span>
                        <span className="Playlist-Content-SongDetails-Description-Text">
                            {Data?.Year}
                        </span>
                        <span className="Playlist-Content-SongDetails-Description-Separators">
                            •
                        </span>
                        <span className="Playlist-Content-SongDetails-Description-Text">
                            {Data?.Songs?.length} Songs
                        </span>
                    </div>
                </div>
                <div id="Playlist-Content-List">
                    <div id="Playlist-Content-List-Header">
                        <div id="Playlist-Content-List-Header-Number">#</div>
                        <div id="Playlist-Content-List-Header-Title">Title</div>
                        <div id="Playlist-Content-List-Header-Duration">Duration</div>
                    </div>
                    <ul id="Playlist-Content-List-Content">
                        {
                            Data?.Songs.map(({ Title, Artist, Duration, Id, Album }, index) =>
                                <li key={index} className="Playlist-Content-List-Content-Element"
                                    onDoubleClick={() => handlePlayerSong(index)}
                                >
                                    <p className="Playlist-Content-List-Content-Element-Number">{
                                        (PlayerState.State && PlayerState.Data.Id === Id && Include(`/${QueueState.PlaylistID}`))
                                            ? <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif" width={15} height={15} />
                                            : index + 1
                                    }</p>
                                    <div className="Playlist-Content-List-Content-Element-Data">
                                        <span>{Title}</span>
                                        <small>
                                            {
                                                Artist.map(({ Name, URL }, index) =>
                                                    <Link key={index} to={URL}>
                                                        {`${((Artist.length > 1) && index > 0) ? ", " : ""}${Name}`}
                                                    </Link>
                                                )
                                            }
                                        </small>
                                    </div>
                                    <p className="Playlist-Content-List-Content-Element-Duration">
                                        {formatTime(Duration)}
                                    </p>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <div id="Playlist-Sidebar">
                <img id="Playlist-Sidebar-Image" src={Data?.imageURL} alt={Data?.Title} width={320} height={320} />
                <div id="Playlist-Sidebar-SongGenres">
                    {
                        Data?.Songs?.length! > 0 && Data?.Songs?.map(({ Genres }) =>
                            Genres?.map((value, index) =>
                                <div key={index} className="Playlist-Sidebar-SongGenres-Elements">{value}</div>
                            )
                        )
                    }
                </div>
                <div id="Playlist-Sidebar-Artist">
                    {
                        Data?.Artist && Data.Artist.map(({ ImageURL, Name, URL }, index) =>
                            <Link to={URL} key={index}>
                                <div className="Playlist-Sidebar-Artist-Element">
                                    <img src={ImageURL} alt={Name} className="Playlist-Sidebar-Artist-Element-Image" />
                                    <div className="Playlist-Sidebar-Artist-Element-Details">
                                        <p>{Name}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}