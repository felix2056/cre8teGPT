import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const AdCopyGenerator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isGenerating, setIsGenerating] = useState(false);
    const [adCopy, setAdCopy] = useState({ headline: "", description: "", cta: "", platform: "Google" });

    const generate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = {
            productName: formData.get("productName"),
            description: formData.get("description"),
            targetAudience: formData.get("targetAudience"),
            usp: formData.get("usp"),
            cta: formData.get("cta"),
            tone: formData.get("tone"),
            platform: formData.get("platform"),
            specialOffers: formData.get("specialOffers"),
            keywords: formData.get("keywords"),
            additionalDetails: formData.get("additionalDetails"),
        };

        if (!session) {
            router.push("/auth/signin?redirect=/dashboard/ad-copy-generator");
            return;
        }

        if (!data.productName || !data.description || !data.targetAudience || !data.usp || !data.cta || !data.platform) {
            toast.error("Please fill in all the required fields.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        setIsGenerating(true);

        try {
            const response = await axios.post("/api/tools/generators/ad-copy-generator", { data });

            if (response.data.adCopy) {
                setAdCopy(response.data.adCopy);
            }
            setIsGenerating(false);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while generating the ad copy.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsGenerating(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Content Generators</span>
                                    <h2 className="title">
                                        Ad Copy Generator
                                    </h2>

                                    <p className="disc">
                                        Generate ad copy for your marketing campaigns using the Ad Copy Generator tool. Fill in the required fields and click the "Generate Ad Copy" button to get started.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form onSubmit={generate}>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Product Name</label>
                                                            <input type="text" name="productName" required placeholder="The name of the product or service being advertised" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Description</label>
                                                            <textarea name="description" required placeholder="A brief description of the product, highlighting its features and benefits"></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Target Audience</label>
                                                            <input type="text" name="targetAudience" required placeholder="The demographic information of the target audience (age, gender, interests, etc.)" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Unique Selling Proposition (USP)</label>
                                                            <textarea name="usp" required placeholder="What sets the product apart from its competitors"></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Call to Action (CTA)</label>
                                                            <input type="text" name="cta" required placeholder="The desired action you want the audience to take (e.g., 'Buy Now', 'Sign Up Today')" />
                                                        </div>
                                                        <div className="form-group nice-select-wrap">
                                                            <label className="text-left h5">Tone/Style</label>
                                                            <select className="nice-select" name="tone">
                                                                <option value="">Select Tone</option>
                                                                <option value="Friendly">Friendly</option>
                                                                <option value="Professional">Professional</option>
                                                                <option value="Humorous">Humorous</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Platform (optional)</label>
                                                            <select name="platform">
                                                                <option value="">Select Platform</option>
                                                                <option value="Google">Google</option>
                                                                <option value="Facebook">Facebook</option>
                                                                <option value="Instagram">Instagram</option>
                                                                <option value="Twitter">Twitter</option>
                                                                <option value="LinkedIn">LinkedIn</option>
                                                                <option value="Pinterest">Pinterest</option>
                                                                <option value="Reddit">Reddit</option>
                                                                <option value="Quora">Quora</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Special Offers</label>
                                                            <input type="text" name="specialOffers" placeholder="Any discounts, promotions, or special offers to be included in the ad" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Keywords</label>
                                                            <input type="text" name="keywords" placeholder="Specific keywords to be included in the ad copy" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Additional Details</label>
                                                            <input type="text" name="additionalDetails" placeholder="Any other specific details or requests for the ad copy" />
                                                        </div>
                                                        <div className="form-group">
                                                            <button type="submit" className="generate-btn position-relative" style={{ width: "100%", left: "0", right: "0", transform: "none" }}>
                                                                {isGenerating ? ("Generating") : ("Generate")}
                                                                {isGenerating ? (
                                                                    <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                                ) : (
                                                                    <img src="/images/icons/13.png" alt="" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                        {(adCopy && adCopy.headline) && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row mt--20">
                                            <div className="col-lg-4 offset-lg-0">
                                                <div className="form-group">
                                                    <label className="text-left h5">Ad Headline</label>
                                                    <input type="text" defaultValue={adCopy.headline} />
                                                </div>

                                                <div className="form-group">
                                                    <label className="text-left h5">Ad Description</label>
                                                    <textarea defaultValue={adCopy.description}></textarea>
                                                </div>

                                                <div className="form-group">
                                                    <label className="text-left h5">Platform</label>
                                                    <select defaultValue={adCopy.platform} onChange={(e) => setAdCopy({ ...adCopy, platform: e.target.value })}>
                                                        <option value="Google">Google</option>
                                                        <option value="Facebook">Facebook</option>
                                                        <option value="Instagram">Instagram</option>
                                                        <option value="Twitter">Twitter</option>
                                                        <option value="LinkedIn">LinkedIn</option>
                                                        <option value="Pinterest">Pinterest</option>
                                                        <option value="Reddit">Reddit</option>
                                                        <option value="Quora">Quora</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-8 offset-lg-0">
                                                {adCopy.platform === "Google" && (
                                                <div className="google-ad-preview mt--30">
                                                    <div className="ad-label">Ad</div>
                                                    <div className="ad-title">
                                                        <a href="#" id="ad-title-link">{adCopy.headline}</a>
                                                    </div>
                                                    <div className="ad-url">
                                                        <a href="#" id="ad-url-link">www.example.com</a>
                                                    </div>
                                                    <div className="ad-description">
                                                        <span id="ad-description">{adCopy.description}</span>
                                                    </div>
                                                    <div className="ad-site-links">
                                                        <a href="#">Link 1</a>
                                                        <a href="#">Link 2</a>
                                                        <a href="#">Link 3</a>
                                                        <a href="#">Link 4</a>
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "Facebook" && (
                                                <div className="facebook-ad-preview mt--30">
                                                    <div className="ad-header">
                                                        <img src="https://fakeimg.pl/150x100" alt="Profile Picture" className="profile-picture" />
                                                        <div className="ad-header-text">
                                                            <div className="profile-name">Example Business</div>
                                                            <div className="ad-sponsor">Sponsored</div>
                                                        </div>
                                                    </div>
                                                    <div className="ad-content">
                                                        <div className="ad-text" id="ad-text">
                                                            {adCopy.description}
                                                        </div>
                                                        <img src="https://fakeimg.pl/600x400" alt="Ad Image" className="ad-image" />
                                                    </div>
                                                    <div className="ad-footer">
                                                        <a href="#" className="cta-button" id="cta-button">{adCopy.cta}</a>
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "Instagram" && (
                                                <div className="instagram-ad-preview mt--30">
                                                    <div className="ad-header">
                                                        <img src="https://fakeimg.pl/150x100" alt="Profile Picture" className="profile-pic" />
                                                        <div className="ad-user-info">
                                                            <span className="ad-username">@example_user</span>
                                                            <span className="ad-sponsored">Sponsored</span>
                                                        </div>
                                                        <div className="ad-menu">•••</div>
                                                    </div>
                                                    <img src="https://fakeimg.pl/600x400" alt="Ad Image" className="ad-image" />
                                                    <div className="ad-interactions">
                                                        <div className="interaction-icons">
                                                            <span>❤️</span>
                                                            <span>💬</span>
                                                            <span>📤</span>
                                                        </div>
                                                        <div className="ad-save">🔖</div>
                                                    </div>
                                                    <div className="ad-likes">Liked by <strong>user1</strong> and <strong>others</strong></div>
                                                    <div className="ad-caption">
                                                        <strong>example_user</strong> Discover our new product! It's designed to enhance your daily experience. #newproduct #innovation
                                                    </div>
                                                    <div className="ad-comments">
                                                        <strong>user2</strong> Looks amazing! 😍
                                                    </div>
                                                    <div className="ad-add-comment">
                                                        <input type="text" placeholder="Add a comment..." />
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "Twitter" && (
                                                <div className="twitter-ad-preview mt--30">
                                                    <div className="ad-header">
                                                        <img src="https://fakeimg.pl/150x100" alt="Profile" className="ad-profile-image" />
                                                        <div className="ad-user-info">
                                                            <div className="ad-user-name">Example Product</div>
                                                            <div className="ad-user-handle">@exampleproduct</div>
                                                            <div className="ad-badge">Promoted</div>
                                                        </div>
                                                    </div>
                                                    <div className="ad-content">
                                                        <p>{adCopy.description}</p>
                                                        <img src="https://fakeimg.pl/600x400" alt="Ad Image" className="ad-image" />
                                                    </div>
                                                    <div className="ad-actions">
                                                        <a href="#" className="ad-action"><i className="fa fa-comment"></i></a>
                                                        <a href="#" className="ad-action"><i className="fa fa-retweet"></i></a>
                                                        <a href="#" className="ad-action"><i className="fa fa-heart"></i></a>
                                                        <a href="#" className="ad-action"><i className="fa fa-share"></i></a>
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "LinkedIn" && (
                                                <div className="linkedin-ad-preview mt--30">
                                                    <div className="ad-header">
                                                        <img src="https://fakeimg.pl/150x100" alt="Company Logo" className="ad-logo" />
                                                        <div className="ad-header-text">
                                                            <div className="ad-company-name">Example Company</div>
                                                            <div className="ad-sponsored-label">Sponsored</div>
                                                        </div>
                                                    </div>
                                                    <div className="ad-content">
                                                        <div className="ad-title">{adCopy.headline}</div>
                                                        <div className="ad-description">
                                                            {adCopy.description}
                                                        </div>
                                                    </div>
                                                    <div className="ad-image">
                                                        <img src="https://fakeimg.pl/600x400" alt="Ad Image" />
                                                    </div>
                                                    <div className="ad-actions">
                                                        <a href="#" className="ad-action-button">{adCopy.cta}</a>
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "Pinterest" && (
                                                <div className="pinterest-ad-preview mt--30">
                                                    <div className="ad-image">
                                                        <img src="https://fakeimg.pl/600x400" alt="Ad Image" />
                                                    </div>
                                                    <div className="ad-content">
                                                        <div className="ad-label">Promoted by</div>
                                                        <div className="ad-title" id="ad-title">{adCopy.headline}</div>
                                                        <div className="ad-description" id="ad-description">{adCopy.description}</div>
                                                        <div className="ad-url" id="ad-url">www.example.com</div>
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "Reddit" && (
                                                <div className="reddit-post-preview mt--30">
                                                    <div className="vote-section">
                                                        <a href="#" className="vote-button">▲</a>
                                                        <div className="vote-count">123</div>
                                                        <a href="#" className="vote-button">▼</a>
                                                    </div>
                                                    <div className="post-content">
                                                        <div className="post-header">
                                                            <div className="subreddit-name">r/example</div>
                                                            <div className="user-info">Posted by u/example_user 4 hours ago</div>
                                                        </div>
                                                        <div className="post-title">{adCopy.headline}</div>
                                                        <div className="post-body">
                                                            <p>{adCopy.description}</p>
                                                        </div>
                                                        <div className="post-footer">
                                                            <a href="#" className="post-footer-link">15 Comments</a>
                                                            <a href="#" className="post-footer-link">Share</a>
                                                            <a href="#" className="post-footer-link">Save</a>
                                                            <a href="#" className="post-footer-link">Hide</a>
                                                            <a href="#" className="post-footer-link">Report</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                )}

                                                {adCopy.platform === "Quora" && (
                                                <div className="quora-ad-preview mt--30">
                                                    <div className="ad-label">Sponsored by <span id="ad-sponsor">Example Company</span></div>
                                                    <div className="ad-title">
                                                        <a href="#" id="ad-title-link">{adCopy.headline}</a>
                                                    </div>
                                                    <div className="ad-description" id="ad-description">
                                                        {adCopy.description}
                                                    </div>
                                                    <div className="ad-read-more">
                                                        <a href="#" id="ad-read-more-link">{adCopy.cta}</a>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdCopyGenerator;