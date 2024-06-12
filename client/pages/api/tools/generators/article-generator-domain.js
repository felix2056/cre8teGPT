import { getSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

import axios from 'axios';
import cheerio from 'cheerio';
import nlp from 'compromise';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { input } = req.body;

    try {
        let url = input;
        if (!url.startsWith('http')) {
            url = 'http://' + url;
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let keywords = [];

        // extract keywords from domain meta tags
        $('meta[name="keywords"]').each((_, element) => {
            const content = $(element).attr('content');
            if (content) {
              keywords.push(...content.split(',').map(keyword => keyword.trim()));
            }
        });

        const links = $('a').map((i, el) => $(el).attr('href')).get();
        const uniqueLinks = [...new Set(links)];
        // console.log("Unique links:", uniqueLinks);

        let count = 0;
        let maxLinks = 10;

        for (const link of uniqueLinks) {
            if (link.startsWith('/')) {
                if (count >= maxLinks) break;
                console.log("Fetching keywords from:", url + link);
                const pageKeywords = await fetchKeywordsFromUrl(url + link);
                keywords.push(...pageKeywords);
                count++;
            }
        }

        return res.status(200).json({ keywords });
    } catch (error) {
        console.error("Error extracting domain keywords:", error);
        res.status(500).json({ title: "Error extracting domain keywords", message: error.message });
    }
}

async function fetchKeywordsFromUrl(url) {
    const response = await axios.get(url);

    if (response.status !== 200) {
        console.error(`Error fetching URL: ${url}`);
        return [];
    }

    const $ = cheerio.load(response.data);
    
    const headings = $('h1, h2, h3, h4, h5, h6').map((i, el) => $(el).text()).get();
    const paragraphs = $('p').map((i, el) => $(el).text()).get();
    const urls = $('a').map((i, el) => $(el).attr('href')).get();
    const spans = $('span').map((i, el) => $(el).text()).get();
    // const divs = $('div').map((i, el) => $(el).text()).get();
    const text = [...headings, ...paragraphs, ...spans].join(' ');

    const keywords = extractKeywords(text);
    return keywords;
}

function extractKeywords(text) {
    const doc = nlp(text);

    const keywords = [];

    // extract keyword topics
    // const topics = doc.topics().out('array');
    // keywords.push(...topics);

    // extract keyword nouns
    const nouns = doc.nouns().out('array');
    keywords.push(...nouns);

    // extract keyword organizations
    // const organizations = doc.organizations().out('array');
    // keywords.push(...organizations);

    // extract keyword people
    // const people = doc.people().out('array');
    // keywords.push(...people);

    // extract keyword places
    // const places = doc.places().out('array');
    // keywords.push(...places);

    // extract keyword values
    // const values = doc.values().out('array');
    // keywords.push(...values);

    let filteredKeywords;

    // remove empty keywords
    filteredKeywords = keywords.filter(keyword => keyword.trim().length > 0);

    // remove keywords with numbers
    const numbers = /\d/;
    filteredKeywords = filteredKeywords.filter(keyword => !numbers.test(keyword));

    // remove keywords with less than 3 characters
    filteredKeywords = filteredKeywords.filter(keyword => keyword.length > 2);

    // transform keywords to lowercase
    filteredKeywords = keywords.map(keyword => keyword.toLowerCase());

    // remove keywords shorter than 3 words
    filteredKeywords = keywords.filter(keyword => keyword.split(' ').length > 2);

    // remove keywords longer than 50 characters
    filteredKeywords = filteredKeywords.filter(keyword => keyword.length <= 50);

    // remove keywords with special characters
    const specialChars = /[^a-zA-Z0-9 ]/g;
    filteredKeywords = filteredKeywords.map(keyword => keyword.replace(specialChars, ''));

    // trim out extra spaces
    filteredKeywords = filteredKeywords.map(keyword => keyword.trim());

    // remove javascript keywords
    const jsKeywords = ['function', 'var', 'let', 'const', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'finally', 'new', 'class', 'extends', 'super', 'this', 'static', 'import', 'export', 'default', 'from', 'as', 'await', 'async', 'await', 'yield', 'let', 'const', 'typeof', 'instanceof', 'void', 'delete', 'in', 'of', 'with', 'debugger', 'arguments', 'eval', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'prototype', 'constructor', 'get', 'set', 'has', 'is', 'define', 'property', 'descriptor', 'enumerable', 'configurable', 'writable', 'value', 'length', 'name', 'arguments', 'caller', 'callee', 'apply', 'call', 'bind', 'toString', 'valueOf', 'toSource', 'toJSON', 'toLocaleString', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent', 'escape', 'unescape', 'eval', 'parse', 'stringify', 'format', 'print', 'log', 'warn', 'error', 'info', 'debug', 'trace', 'assert', 'clear', 'count', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'timeline', 'timelineEnd', 'markTimeline', 'memory', 'memoryEnd', 'exception', 'exceptionEnd', 'assert', 'assertEnd', 'console', 'window', 'document', 'navigator', 'screen', 'history', 'location', 'localStorage', 'sessionStorage', 'cookie', 'alert', 'confirm', 'prompt', 'open', 'close', 'focus', 'blur', 'scroll', 'resize', 'move', 'onload', 'onunload', 'onresize', 'onscroll', 'onfocus', 'onblur', 'onerror', 'onabort', 'onloadstart', 'onloadend', 'onprogress'];
    filteredKeywords = filteredKeywords.filter(keyword => !jsKeywords.includes(keyword.toLowerCase()));
    
    // remove duplicates
    filteredKeywords = [...new Set(filteredKeywords)];

    return filteredKeywords;
}
