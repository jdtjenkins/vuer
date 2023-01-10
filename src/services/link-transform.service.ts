import { AxiosResponse } from 'axios';
import axios from 'axios';

// Interfaces
import { FullLink } from '../interfaces/link.interface';

export class LinkService {
	public static async linkSwitch(link: string): Promise<FullLink | null> {

		if (link.includes('gfycat')){
			return LinkService.gfycat(link);
		}

		// https://www.redgifs.com/watch/uniqueoffensivehoki
		if (link.includes('redgifs')){
			return LinkService.redgifs(link);
		}

		if (link.includes('reddit') && link.includes('comments')){
			return LinkService.redditPost(link);
		}

		/** This won't work for now. v.redd.it does not allow embedding videos */
		// if (link.includes('v.redd.it')) {
		//     return LinkService.vReddit(link);
		// }

		if (link.includes('imgur')) {
			return LinkService.imgur(link);
		}

		if (link.includes('pornhub')){
			return LinkService.pornhub(link);
		}

		if (link.includes('eporner')){
			return LinkService.eporner(link);
		}

		if (link.includes('i.redd.it') || link.includes('i.redditmedia.com')){
			return LinkService.iReddit(link);
		}

		if (link.includes('youtube') || link.includes('youtu.be')) {
			return LinkService.youtube(link);
		}

		if (link.includes('twitch')) {
			return LinkService.twitch(link);
		}

		if (
			new RegExp('reddit.com\/r\/.*(\/?)$', 'i').test(link) ||
			new RegExp('^r\/.*(\/?)$', 'i').test(link)
		) {
			return LinkService.subreddit(link);
		}

		if (
			new RegExp('reddit.com\/u\/.*(\/?)$', 'i').test(link) ||
			new RegExp('^u\/.*(\/?)$', 'i').test(link) ||
			new RegExp('^\/u\/.*(\/?)$', 'i').test(link) ||
			new RegExp('user\/.*(\/?)$', 'i').test(link) ||
			new RegExp('\/user\/.*(\/?)$', 'i').test(link)
		) {
			return LinkService.redditUser(link);
		}

		return null;
	}

	public static async gfycat(link: string): Promise<FullLink> {
		let slug = link.split('/').pop();
		slug = slug!.replace('.gif', '');

		let apiData: AxiosResponse;

		try {
			apiData = await axios.get(`https://api.gfycat.com/v1/gfycats/${slug}`);
		} catch(e) {
			throw new Error(e)
		}

		return {
			link,
			platform: 'video',
			transformedLink: link,
			mp4: apiData.data.gfyItem.mp4Url,
		};
	}

	public static async redgifs(link: string): Promise<FullLink> {
		const iframeLink = link.split('-')[0].replace('watch', 'ifr');

		return {
			link,
			platform: 'embed',
			transformedLink: iframeLink,
		};
	}

	public static async redditPost(link: string): Promise<FullLink> {
		let apiData: AxiosResponse;

		try {
			apiData = await axios.get(`${link}.json`);
		} catch(e) {
			throw new Error(e);
		}

		const postData = apiData.data[0].data.children[0].data;

		if (postData.url.includes('gfycat')){
			return LinkService.gfycat(postData.url);
		}

		if (postData.url.includes('v.redd.it')) {
			const vRedditVideoUrl = apiData.data[0].data.children[0].data.secure_media.reddit_video.fallback_url;
			return LinkService.vReddit(vRedditVideoUrl);
		}

		return {
			link,
			platform: 'image',
			transformedLink: postData.url,
		}
	}

	public static async vReddit(link: string): Promise<FullLink> {
		return {
			link,
			platform: 'video',
			transformedLink: link,
		}
	}

	public static async iReddit(link: string): Promise<FullLink> {
		return {
			link,
			platform: 'image',
			transformedLink: link,
		}
	}

	public static async imgur(link: string): Promise<FullLink> {
		const fileName = link.split('/').pop();
		const fileHash = fileName!.split('.')[0];
		const fileType = fileName!.split('.').pop();

		if (fileType === 'gifv') {
			let apiData: AxiosResponse;

			try {
				apiData = await axios.get(`https://api.imgur.com/3/image/${ fileHash }`);
			} catch(e) {

			}

			return {
				id: performance.now(),
				link,
				platform: 'video',
				transformedLink: link,
				mp4: apiData?.data?.data?.mp4 || `https://i.imgur.com/${ fileHash }.mp4`,
			};
		}

		return {
			link,
			platform: 'image',
			transformedLink: link,
		}
	}


	public static async pornhub(link: string): Promise<FullLink> {
		const viewKey = link.split('?viewkey=').pop();

		return {
			link,
			platform: 'embed',
			transformedLink: `https://www.pornhub.com/embed/${ viewKey }`,
		}
	}

	// https://www.eporner.com/hd-porn/wdOE4NBPxXF/Pornstar-Roadtrip/
	public static async eporner(link: string): Promise<FullLink> {
		const viewKey = link.split('/')[4];

		return {
			link,
			platform: 'embed',
			transformedLink: `https://www.eporner.com/embed/${ viewKey }`,
		}
	}

	// https://www.youtube.com/watch?v=HNt_4IXhO3Q, https://youtu.be/Q-yCBTKbBnw?t=691
	public static async youtube(link: string): Promise<FullLink> {
		let viewKey: string;

		if (link.includes('?v=')) {
			viewKey = <string>link.split('?v=').pop();
		} else {
			viewKey = <string>link.split('/').pop();
		}

		return {
			link,
			platform: 'embed',
			transformedLink: `https://www.youtube.com/embed/${ viewKey }?modestbranding=1`,
		}
	}

	// https://www.twitch.tv/LorelessGame
	public static async twitch(link: string): Promise<FullLink> {
		const viewKey = link.split('/').pop();

		return {
			link,
			platform: 'embed',
			transformedLink: `https://player.twitch.tv?channel=${ viewKey }&parent=vuer.xyz`,
		}
	}

	// https://www.reddit.com/r/pics, r/pics, /r/pics, /r/pics/
	public static async subreddit(link: string): Promise<FullLink> {
		let transformedLink = link;

		// Remove trailing slashes
		transformedLink = transformedLink.replace(/\/+$/, '');

		const subreddit = transformedLink.split('/').pop();

		transformedLink = `https://www.reddit.com/r/${ subreddit }`;

		return {
			link,
			platform: 'subreddit',
			transformedLink,
		}
	}

	// https://www.reddit.com/u/spo0pykitten, https://www.reddit.com/user/spo0pykitten, u/spo0pykitten, /u/spo0pykitten, /u/spo0pykitten/
	public static async redditUser(link: string): Promise<FullLink> {
		let transformedLink = link;

		// Remove trailing slashes
		transformedLink = transformedLink.replace(/\/+$/, '');

		const redditUser = transformedLink.split('/').pop();

		transformedLink = `https://www.reddit.com/user/${ redditUser }`;

		return {
			link,
			platform: 'subreddit',
			transformedLink,
		}
	}

}
