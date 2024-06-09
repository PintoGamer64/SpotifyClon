import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

// Assets
import HomePage from "./routes/Home";

// Styles
import "./index.css"

// Components
import Search from "./routes/Search";
import Friends from "./components/Friends";
import LibraryPage from "./routes/Library";
import Player from "./components/Player";
import NowPlaying from "./routes/NowPlaying";

// Contexts
import { SidebarContext } from "../../context";

// Contants
import { MAINSTYLE } from "./constants";

export default function Main() {

    const { SidebarState } = useContext(SidebarContext);

    return (
        <main id="Main">
            <div id="MainContent" style={
                SidebarState.Sidebar === "Friends"
                    ? MAINSTYLE.Friends.true
                    : MAINSTYLE.Friends.false
            }>
                <div id="MainContent-Home">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/library" element={<LibraryPage />}/>
                        <Route path="/now-playing" element={<NowPlaying />}/>
                    </Routes>
                </div>
                {
                    SidebarState.Sidebar === "Friends" && <Friends />
                }
            </div>
            <Player />
        </main>
    )
}