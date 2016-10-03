const m = require("mithril");
const page = require("page");
const Home = require("./Home");
const Search = require("./Search");
const Detail = require("./Detail");
const { states, appstate } = require("lib/appstate");
const { getQuerystring } = require("lib/querystring");
const log = require("lib/log").child(__filename);
const idRegex = /[\da-zA-Z]{8}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{12}/;

const isInitialState = appstate.run(x => [states.INITIAL].indexOf(x) !== -1);
const isSearchState = appstate.run(x => [states.SEARCH, states.RESULT].indexOf(x) !== -1);
const isDetailState = appstate.run(x => [states.DETAIL].indexOf(x) !== -1);

const optional = (pred, cb) => pred ? cb() : "";

const init = ({state}) => {
	appstate.run(state => log.trace("new appstate", state));
	let query = getQuerystring();
	// accept legacy urls
	if(window.location.href.indexOf("/#/player/") !== -1) {
		log.trace("router found legacy url");
		let id = window.location.href
			.split("/#/player/")[1]
			.split("?")[0]
			.replace(/\//g, "");
		query.query = id;
	}
	page("/", function(ctx) {
		appstate(states.INITIAL);
		state.context(ctx);
		m.redraw();
	});
	page("/search", function(ctx) {
		log.trace("router switch to search");
		ctx.query = getQuerystring(ctx.querystring);
		if(ctx.query.query && ctx.query.query.length >2) {
			log.trace("router usable query", ctx);
			appstate(states.SEARCH);
		} else {
			page.redirect("/");
		}
		state.context(ctx);
		m.redraw();
	});
	page("/player/:id", function(ctx) {
		log.trace("router switch to detail");
		ctx.query = getQuerystring(ctx.querystring);
		appstate(states.DETAIL);
		state.context(ctx);
		m.redraw();
	});
	page("*", function(ctx) {
		if(ctx.path.slice(0, 10) === "/#/player/") {
			let id =  ctx.path.slice(11).split(/[\/?#]/)[0];
			page.redirect("/player/" + id);
		} else if(ctx.path.startsWith("//")) {
			log.trace("trying to redirect path", ctx);
			page.redirect(ctx.path.substr(1));
		}
		log.warn("route not found", ctx);
	});
	page.start({hashbang: true});
};


module.exports = {
	status: appstate,
	detail: m.prop(null),
	oninit: init,
	context: m.prop({}),
	view: ({ state }) => (
		<div className={"app " + appstate()}>
			<div className="app-background">
				<img class="clear" src="/assets/skullrain-skull.jpg" />
				<img class="blur" src="/assets/skullrain-skull-blurred.jpg" />
			</div>
			<div className="app-pages">
				<div className="app-page">
				{optional(isInitialState(), () => <Home context={state.context}/>)}
				{optional(isSearchState(), () => <Search context={state.context}/>)}
				</div>
				<div className="app-page">
				{optional(isDetailState(), () => <Detail context={state.context} onBackdropClick={state.hideFocus}/>)}
				</div>
			</div>
		</div>
	)
};
