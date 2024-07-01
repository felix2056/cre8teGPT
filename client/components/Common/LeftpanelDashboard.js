import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import avatar from "../../public/images/team/team-01.webp";

import UserMenuItems from "../Header/HeaderProps/UserMenuItems";

import HeaderData from "../../data/header.json";
import { useAppContext } from "@/context/Context";

import { useSession } from "next-auth/react";

const LeftpanelDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { shouldCollapseLeftbar } = useAppContext();

  const isActive = (href) => router.pathname === href;

  const generators = [
    {
      name: "AI Chat",
      description: "Running GPT-4o, our AI chat tool can help you generate human-like text responses to any prompt or question you provide.",
      slug: "/tools/generators/ai-chat",
      icon: "/images/generator-icon/text_line.png",
      badge: "",
    },
    {
      name: "Image Generator",
      description: "Create stunning images for your website, social media, or marketing campaigns with our AI-powered image generator.",
      slug: "/dashboard/image-generator",
      icon: "/images/generator-icon/photo_line.png",
      badge: "",
    },
    {
      name: "Image Generator V2",
      description: "Create stunning images for your website, social media, or marketing campaigns with our AI-powered image generator.",
      slug: "/tools/generators/image-generator",
      icon: "/images/generator-icon/photo_line.png",
      badge: "new",
    },
    {
      name: "Article Generator",
      description: "Stop staring at a blank page. Generate high-quality, SEO-friendly articles from keywords, domains, or URLs.",
      slug: "/tools/generators/article-generator",
      icon: "/images/generator-icon/article_line.png",
      badge: "",
    },
    {
      name: "Lyrics Generator",
      description: "Generate song lyrics for your music project, podcast, or video content with our AI-powered lyrics generator.",
      slug: "/dashboard/lyrics-generator",
      icon: "/images/generator-icon/lyrics_line.png",
      badge: "",
    },
    {
      name: "Ad Copy Generator",
      description: "Create compelling ad copy for your marketing campaigns with our AI-powered ad copy generator.",
      slug: "/dashboard/tools/ad-copy-generator",
      icon: "/images/generator-icon/ad-copy_line.png",
      badge: "",
    },
    {
      name: "Marketing Email Generator",
      description: "Generate marketing emails for your business or brand with our AI-powered email generator.",
      slug: "/tools/generators/marketing-email-generator",
      icon: "/images/generator-icon/email_line.png",
      badge: "",
    },
    {
      name: "Recipe Generator",
      description: "Our recipe generator suggests delicious dishes based on your available ingredients, helping you cook with what you have at home.",
      slug: "/tools/generators/recipe-generator",
      icon: "/images/generator-icon/recipe_line.png",
      badge: "",
    },
    {
      name: "Text to speech",
      description: "Convert any text into a human-like voice with our AI-powered text-to-speech generator.",
      slug: "/dashboard/text-to-speech",
      icon: "/images/generator-icon/text-voice_line.png",
      badge: "",
    },
    {
      name: "Speech to text",
      description: "Convert any recording or audio file into text with our AI-powered speech-to-text generator.",
      slug: "/dashboard/speech-to-text",
      icon: "/images/generator-icon/voice_line.png",
      badge: "",
    },
    {
      name: "YouTube Summarizer",
      description: "Summarize any YouTube video into a concise text summary with our AI-powered YouTube video summarizer.",
      slug: "/tools/generators/youtube-summarizer",
      icon: "/images/generator-icon/youtube-summarizer_line.png",
      badge: "",
    },
    {
      name: "YouTube Channel Analyzer",
      description: "Analyze any YouTube channel, video, or playlist with our AI-powered YouTube channel analyzer.",
      slug: "/tools/generators/youtube-channel-analyzer",
      icon: "/images/generator-icon/youtube-channel-analyzer_line.png",
      badge: "",
    },
    {
      name: "YouTube Thumbnail Generator",
      description: "Create eye-catching thumbnails for your YouTube videos with our AI-powered YouTube thumbnail generator.",
      slug: "/tools/generators/youtube-thumbnail-generator",
      icon: "/images/generator-icon/youtube-thumbnail-generator_line.png",
      badge: "coming",
    },
    {
      name: "Code Generator",
      description: "Generate code snippets, scripts, or templates for your programming projects with our AI-powered code generator.",
      slug: "/tools/generators/code-generator",
      icon: "/images/generator-icon/code-editor_line.png",
      badge: "coming",
    },
    {
      name: "Website Generator",
      description: "Create a professional website in minutes with our AI-powered website generator. No coding or design skills required.",
      slug: "/tools/generators/website-generator",
      icon: "/images/generator-icon/website-design_line.png",
      badge: "coming",
    },
    {
      name: "XML Sitemap Generator",
      description: "Create an XML sitemap for your website to improve search engine optimization (SEO) with our AI-powered sitemap generator.",
      slug: "/tools/generators/xml-sitemap-generator",
      icon: "/images/generator-icon/xml-sitemap_line.png",
      badge: "coming",
    },
    {
      name: "Logo Generator",
      description: "Design a unique logo for your brand or business with our AI-powered logo generator.",
      slug: "/tools/generators/logo-generator",
      icon: "/images/logo/favicon.png",
      badge: "coming",
    },
    {
      name: "Video Generator",
      description: "Quickly create engaging videos for your business, blog, or social media with our AI-powered video generator.",
      slug: "/dashboard/video-generator",
      icon: "/images/generator-icon/video-camera_line.png",
      badge: "coming",
    },
  ];

  const editors = [
    {
      name: "'Photo Editor",
      description: "Edit and enhance your photos with our AI-powered photo editor. Remove backgrounds, retouch images, and more.",
      slug: "/dashboard/photo-editor",
      icon: "/images/editor-icon/photo-editor_line.png",
      badge: "",
    },
    {
      name: "Video Editor",
      description: "Edit and enhance your videos with our AI-powered video editor. Add effects, trim clips, and more.",
      slug: "/tools/editors/video-editor",
      icon: "/images/editor-icon/video-editor_line.png",
      badge: "coming",
    }
  ];

  const assistants = [
    {
      name: "Writing Assistant",
      description: "Improve your writing with our AI-powered writing assistant. Get suggestions for grammar, style, and more.",
      slug: "/tools/assistants/writing-assistant",
      icon: "/images/assistant-icon/writing-assistant_line.png",
      badge: "",
    },
    {
      name: "YouTube Video Assistant",
      description: "Get help with your YouTube video ideas, titles, descriptions, tags, and more with our AI-powered YouTube video assistant.",
      slug: "/tools/assistants/youtube-video-assistant",
      icon: "/images/assistant-icon/youtube-assistant_line.png",
      badge: "",
    },
    {
      name: "YouTube Script Assistant",
      description: "Generate video scripts, outlines, or ideas for your YouTube channel with our AI-powered YouTube script assistant.",
      slug: "/tools/assistants/youtube-script-assistant",
      icon: "/images/assistant-icon/youtube-script_line.png",
      badge: "",
    },
    {
      name: "Research Assistant",
      description: "Get help with your research projects, papers, or articles with our AI-powered research assistant.",
      slug: "/tools/assistants/research-assistant",
      icon: "/images/assistant-icon/research-assistant_line.png",
      badge: "coming",
    },
  ];

  return (
    <>
      <div
        className={`rbt-left-panel popup-dashboardleft-section ${shouldCollapseLeftbar ? "collapsed" : ""
          }`}
      >
        <div className="rbt-default-sidebar">
          <div className="inner">
            <div className="content-item-content overflow-y-auto">
              <div className="rbt-default-sidebar-wrapper">
                <nav className="mainmenu-nav">
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <Link
                        className={isActive("/dashboard") ? "active" : ""}
                        href="/dashboard"
                      >
                        <i className="feather-monitor"></i>
                        <span>Welcome</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        className={isActive("/plans-billing") ? "active" : ""}
                        href="/plans-billing"
                      >
                        <i className="feather-briefcase"></i>
                        <span>Manage Subscription</span>
                      </Link>
                    </li>
                  </ul>

                  <div className="rbt-sm-separator"></div>

                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <a href="javascript:void(0)">
                        <i className="feather-layers"></i>
                        <span className="rbt-default-sidebar-title">Content Generators</span>
                      </a>
                    </li>

                    {generators.map((data, index) => (
                      <li key={index}>
                        <Link
                          href={data.slug}
                          className={isActive(data.link) ? "active" : `${data.badge == 'coming' ? "disabled" : ""}`}
                        >
                          <Image
                            src={data.icon}
                            width={20}
                            height={20}
                            alt={data.name}
                          />

                          <span>{data.name}</span>

                          {data.badge !== "" && (
                            <div className="rainbow-badge-card badge-sm ml--10">
                              {data.badge}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="rbt-sm-separator"></div>

                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <a href="javascript:void(0)">
                        <i className="feather-layers"></i>
                        <span className="rbt-default-sidebar-title">Content Editors</span>
                      </a>
                    </li>

                    {editors.map((data, index) => (
                      <li key={index}>
                        <Link
                          href={data.slug}
                          className={isActive(data.link) ? "active" : `${data.badge == 'coming' ? "disabled" : ""}`}
                        >
                          <Image
                            src={data.icon}
                            width={20}
                            height={20}
                            alt={data.name}
                          />

                          <span>{data.name}</span>

                          {data.badge !== "" && (
                            <div className="rainbow-badge-card badge-sm ml--10">
                              {data.badge}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="rbt-sm-separator"></div>

                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <a href="javascript:void(0)">
                        <i className="feather-layers"></i>
                        <span className="rbt-default-sidebar-title">Content Assistants</span>
                      </a>
                    </li>

                    {assistants.map((data, index) => (
                      <li key={index}>
                        <Link
                          href={data.slug}
                          className={isActive(data.link) ? "active" : `${data.badge == 'coming' ? "disabled" : ""}`}
                        >
                          <Image
                            src={data.icon}
                            width={20}
                            height={20}
                            alt={data.name}
                          />

                          <span>{data.name}</span>

                          {data.badge !== "" && (
                            <div className="rainbow-badge-card badge-sm ml--10">
                              {data.badge}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="rbt-sm-separator"></div>

                <nav className="mainmenu-nav">
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li className="has-submenu">
                      <a
                        className="collapse-btn collapsed"
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        <i className="feather-plus-circle"></i>
                        <span>Setting</span>
                      </a>
                      <div className="collapse" id="collapseExample">
                        <UserMenuItems parentClass="submenu rbt-default-sidebar-list" />
                      </div>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="feather-award"></i>
                        <span>Help & FAQ</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="rbt-sm-separator"></div>
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <Link
                        className={isActive("/release-notes") ? "active" : ""}
                        href="/release-notes"
                      >
                        <i className="feather-bell"></i>
                        <span>Release notes</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={isActive("/terms-policy") ? "active" : ""}
                        href="/terms-policy"
                      >
                        <i className="feather-briefcase"></i>
                        <span>Terms & Policy</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div className="subscription-box">
            <div className="inner">
              <Link href="/profile-details" className="autor-info">
                <div className="author-img active">
                  <Image
                    className="w-100"
                    width={40}
                    height={40}
                    src={session?.user?.avatar || avatar}
                    alt="Author"
                  />
                </div>
                <div className="author-desc">
                  <h6>{session?.user?.full_name}</h6>
                  <p>{session?.user?.email}</p>
                </div>
                <div className="author-badge">Free</div>
              </Link>
              <div className="btn-part">
                <Link href="/pricing" className="btn-default btn-border">
                  Upgrade To Pro
                </Link>
              </div>
            </div>
          </div>
          <p className="subscription-copyright copyright-text text-center b4  small-text">
            © 2024
            <Link
              className="ps-2"
              href="https://themeforest.net/user/rainbow-themes/portfolio"
            >
              Rainbow Themes
            </Link>
            .
          </p>
        </div>
      </div >
    </>
  );
};

export default LeftpanelDashboard;
