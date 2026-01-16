import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	FOLDER_CATEGORY_ROOT,
	getCategoryUrl,
	getFolderParamFromSlug,
	getFolderUrl,
} from "@utils/url-utils.ts";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export type FolderCategory = {
	name: string;
	count: number;
	url: string;
};

export type FolderTreePost = {
	slug: string;
	title: string;
	published: Date;
};

export type FolderTreeNode = {
	name: string;
	path: string;
	count: number;
	posts: FolderTreePost[];
	children: FolderTreeNode[];
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

export async function getFolderCategoryList(): Promise<FolderCategory[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const count: { [key: string]: number } = {};
	const labelMap: { [key: string]: string } = {};

	allBlogPosts.forEach((post) => {
		const folderParam = getFolderParamFromSlug(post.slug);
		const label =
			folderParam === FOLDER_CATEGORY_ROOT
				? i18n(I18nKey.uncategorized)
				: folderParam;
		labelMap[folderParam] = label;
		count[folderParam] = count[folderParam] ? count[folderParam] + 1 : 1;
	});

	const keys = Object.keys(count).sort((a, b) => {
		return labelMap[a].toLowerCase().localeCompare(labelMap[b].toLowerCase());
	});

	return keys.map((key) => ({
		name: labelMap[key],
		count: count[key],
		url: getFolderUrl(key),
	}));
}

export async function getFolderTree(): Promise<FolderTreeNode> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const root = {
		name: "/",
		path: "",
		count: 0,
		posts: [] as FolderTreePost[],
		children: [] as FolderTreeNode[],
		_childMap: new Map<string, any>(),
	};

	for (const post of allBlogPosts) {
		const parts = post.slug.split("/");
		const folders = parts.slice(0, -1);
		let node: any = root;
		node.count++;
		for (const seg of folders) {
			if (!node._childMap.has(seg)) {
				const child = {
					name: seg,
					path: node.path ? `${node.path}/${seg}` : seg,
					count: 0,
					posts: [] as FolderTreePost[],
					children: [] as FolderTreeNode[],
					_childMap: new Map<string, any>(),
				};
				node._childMap.set(seg, child);
				node.children.push(child);
			}
			node = node._childMap.get(seg);
			node.count++;
		}

		node.posts.push({
			slug: post.slug,
			title: post.data.title,
			published: post.data.published,
		});
	}

	const sortNode = (n: any): FolderTreeNode => {
		n.children.sort((a: any, b: any) =>
			a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
		);
		n.posts.sort((a: FolderTreePost, b: FolderTreePost) =>
			a.published > b.published ? -1 : 1,
		);
		n.children = n.children.map(sortNode);
		delete n._childMap;
		return n as FolderTreeNode;
	};

	return sortNode(root);
}
