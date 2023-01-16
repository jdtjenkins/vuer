<template>
	<div class="changelog">
		<h2>Updates</h2>
		<slot name="controls"></slot>
		<section id="changelog-v2.5.2">
			<h3>Version 2.5.2</h3>
			<ul>
				<li>Stop being able to click mobile controls whilst the controls are hidden</li>
				<li>Stop being able to click on the videos loaded. This is to make sure the controls always show correctly</li>
				<li>Fix loading spinner actually checking for the media loading properly</li>
			</ul>
		</section>
		<section id="changelog-v2.5.1">
			<h3>Version 2.5.1</h3>
			<ul>
				<li>Fix mobile controls still showing on hover</li>
			</ul>
		</section>
		<section id="changelog-v2.5">
			<h3>Version 2.5</h3>
			<ul>
				<li>Makes videos and images always fill the box on mobile</li>
				<li>Add tap to hide/show controls on mobile</li>
				<li>Adds loading spinner to subreddit slideshow when you go backwards or forwards</li>
			</ul>
		</section>
		<section id="changelog-v2.4">
			<h3>Version 2.4</h3>
			<ul>
				<li>Improves subreddit slideshow control styles on mobile</li>
				<li>Makes images appear bigger</li>
			</ul>
		</section>
		<section id="changelog-v2.3.1">
			<h3>Version 2.3.1</h3>
			<ul>
				<li>Adds Reddit post title to link button</li>
				<li>Fixes some colours</li>
			</ul>
		</section>
		<section id="changelog-v2.3">
			<h3>Version 2.3</h3>
			<ul>
				<li>You now can't go "Back" on the first post in a subreddit</li>
				<li>Updated some styling of the subreddit controls. Pink was getting a bit meh</li>
				<li>Fixed the subreddit viewer not showing imgur videos consistently</li>
				<li>Added a link to the author of a reddit post in the reddit viewer</li>
			</ul>
		</section>
		<section id="changelog-v2.2.1">
			<h3>Version 2.2.1</h3>
			<ul>
				<li>Adds github link in nav</li>
			</ul>
		</section>
		<section id="changelog-v2.2.0">
			<h3>Version 2.2.0</h3>
			<ul>
				<li>Adds easier forward/back buttons on mobile for reddit slideshows</li>
			</ul>
		</section>
		<section id="changelog-v2.1.2">
			<h3>Version 2.1.2</h3>
			<ul>
				<li>Fix bug where loading a board after loading a board doesn't work</li>
			</ul>
		</section>
		<section id="changelog-v2.1.1">
			<h3>Version 2.1.1</h3>
			<ul>
				<li>Allows uppercase subreddit and reddit usernames eg: <pre>R/aww</pre> <pre>U/internet_adventures</pre></li>
				<li>Reddit slideshow "pause" no longer gets reset when navigating forward/backward</li>
			</ul>
		</section>
		<section id="changelog-v2.1.0">
			<h3>Version 2.1.0</h3>
			<ul>
				<li>Adds sharing and importing boards 🔥</li>
			</ul>
		</section>
		<section id="changelog-v2.0.3">
			<h3>Version 2.0.3</h3>
			<ul>
				<li>Add start/stop button to subreddit/reddit user slideshows</li>
			</ul>
		</section>
		<section id="changelog-v2.0.2">
			<h3>Version 2.0.2</h3>
			<ul>
				<li>Add support for <pre>youtu.be</pre> links</li>
				<li>Add support for YouTube links with timestamps</li>
				<li>Subreddit control overlay now works correctly with Redgifs controls</li>
			</ul>
		</section>
		<section id="changelog-v2.0.1">
			<h3>Version 2.0.1</h3>
			<ul>
				<li>Fix scrollbars showing on modals when not needed</li>
			</ul>
		</section>
		<section id="changelog-v2.0">
			<h3>Version 2.0</h3>
			<ul>
				<li>Re-written in Vue 3 🎉</li>
				<li>
					Improved mobile support 📱
					<ul>
						<li>Nav bar is now across the bottom on mobile</li>
						<li>Subreddits and reddit user slideshows have a mobile modal with controls</li>
					</ul>
				</li>
				<li>
					Can start subreddit and reddit user slideshows
					<ul>
						<li>For subreddits you can type <pre>r/{subreddit}</pre></li>
						<li>For reddit users you can type <pre>u/{user name}</pre></li>
					</ul>
				</li>
				<li>New dark mode 🌑</li>
			</ul>
		</section>
		<section id="changelog-v1.3">
			<h3>Version 1.3</h3>
			<ul>
				<li>
					Adds ability to save/load vuer boards.
					<ul>
						<li>Saves to local storage</li>
						<li>Persists even if you close the tab!</li>
					</ul>
				</li>
			</ul>
		</section>
		<section id="changelog-v1.2">
			<h3>Version 1.2</h3>
			<ul>
				<li>Subreddit slideshows are now infinite</li>
			</ul>
		</section>
		<section id="changelog-v1.1">
			<h3>Version 1.1</h3>
			<ul>
				<li>Adds basic service worker support 🔥. Offline caching & offline PWA install coming soon</li>
			</ul>
		</section>
		<section id="changelog-v1.0">
			<h3>Version 1.0</h3>
			<ul>
				<li>Re-written in Vue 2</li>
				<li>Adds basic subreddit support</li>
				<li>Adds basic twitch support <pre>https://twitch.tv/LorelessGame</pre></li>
			</ul>
		</section>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'vuer-changelog',
	}
</script>

<style lang="scss">
	.changelog {
		& > ul {
			list-style: none;
		}

		pre {
			display: inline-block;
			background-color: #e6e6e6;
			font-family:'Courier New', Courier, monospace;
			padding: 5px 10px;
			margin: 0 0.5rem;
			border: none;
			border-radius: 2px;
		}
	}
</style>
