import * as m from "mithril";
import "./menu.scss";
import Icon, { GLYPHS } from "../Icon";
import Searchbar from "../Searchbar";
import page from "page";
import { isPC, isPS4, isXbox } from "lib/constants";
import Tweet from "./Tweet";

let platform = "PC";
if (isPS4) { platform = "PS4"; }
if (isXbox) {  platform = "XBox"; }


const link = href => e => page(href);

export default {
    view({ attrs, children }) {
        return (
            <div className="menu">
                <div className="menu-top">
                    <div className="menu-logo">
                        <a href="/">
                            <img src="/assets/r6db_logo_new.svg" alt="R6DB Logo"/>
                        </a>
                        <span className="platform">{platform}</span>
                    </div>
                    <div className="menu-platforms">
                        <a href="https://r6db.com"
                            className={`menu-item ${isPC ? "is-active" : ""}`}>PC</a><a href="https://ps4.r6db.com"
                            className={`menu-item ${isPS4 ? "is-active" : ""}`}>PS4</a>
                        <a href="https://xbox.r6db.com"
                            className={`menu-item ${isXbox ? "is-active" : ""}`}>XBOX</a>
                    </div>
                </div>
                <div className="menu-center">
                    <a href="/" className="menu-item">Home</a>
                    <a href="/leaderboard" className="menu-item">Leaderboard</a>
                    <a href="/faq" className="menu-item">FAQ</a>
                    <a href="https://gitlab.com/gitgudscrub/frontend/issues" className="menu-item">Issue / Feature Tracker</a>
                </div>
                <footer className="menu-bottom is-center">
                    <div className="menu-tweets">{
                        attrs.tweets
                            .map(tweet => <Tweet {...tweet} />)
                    }</div>
                    <div className="menu-footer">
                        <a href="https://twitter.com/Rainbow6_DB">
                            <Icon class="menu-twitter" glyph={GLYPHS.TWITTER} />
                        </a>
                        <a href="mailto:info@r6db.com">
                            <Icon class="menu-email" glyph={GLYPHS.EMAIL} />
                        </a>
                    </div>
                </footer>
            </div>
        );
    }
};