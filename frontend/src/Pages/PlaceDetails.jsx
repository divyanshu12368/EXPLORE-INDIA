import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../utils/axiosInstance";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const PlaceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Other images
  const [placeImages, setPlaceImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Promotion
  const [promotion, setPromotion] = useState(null);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoImages, setPromoImages] = useState([]);
  const [promoDescription, setPromoDescription] = useState("");
  const [promoUploading, setPromoUploading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Comments
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const photoInputRef = useRef(null);
  const promoInputRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [placeRes, imagesRes, promotionRes, commentsRes] = await Promise.all([
          api.get(`/api/places/${id}`),
          api.get(`/api/extras/images/${id}`),
          api.get(`/api/extras/promotion/${id}`),
          api.get(`/api/extras/comments/${id}`),
        ]);

        setPlace(placeRes.data.place);
        setPlaceImages(imagesRes.data.images || []);
        setPromotion(promotionRes.data.promotion || null);
        setComments(commentsRes.data.comments || []);

        // Increment view count silently
        api.patch(`/api/places/${id}/view`).catch(() => {});
      } catch (err) {
        setError("Place not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // ── Cloudinary upload helper ──
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );
    return res.data.secure_url;
  };

  // ── Add Place Image ──
  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageError("");
    setImageUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      await api.post(`/api/extras/images/${id}`, {
        imageUrl: url,
        email: user.email,
      });
      setPlaceImages((prev) => [{ imageUrl: url, email: user.email, _id: Date.now() }, ...prev]);
    } catch {
      setImageError("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  // ── Promo image picker ──
  const handlePromoImagePick = async (e) => {
    const files = Array.from(e.target.files);
    if (promoImages.length + files.length > 5) {
      setPromoError("Maximum 5 images allowed.");
      return;
    }
    setPromoError("");
    const previews = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setPromoImages((prev) => [...prev, ...previews]);
  };

  const removePromoImage = (index) => {
    setPromoImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Submit Promotion ──
  const handlePromoSubmit = async () => {
    if (promoImages.length === 0) {
      setPromoError("Please add at least one image.");
      return;
    }
    if (!promoDescription.trim()) {
      setPromoError("Please add a description.");
      return;
    }

    setPromoUploading(true);
    setPromoError("");
    try {
      const uploadedUrls = await Promise.all(
        promoImages.map((img) => uploadToCloudinary(img.file))
      );
      const res = await api.post(`/api/extras/promotion/${id}`, {
        images: uploadedUrls,
        description: promoDescription,
        email: user.email,
      });
      setPromotion(res.data.promotion);
      setShowPromoForm(false);
      setPromoImages([]);
      setPromoDescription("");
      setPromoSuccess("Promotion saved successfully.");
    } catch (err) {
      setPromoError(err.response?.data?.message || "Failed to save promotion.");
    } finally {
      setPromoUploading(false);
    }
  };

  // ── Submit Comment ──
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setCommentSubmitting(true);
    setCommentError("");
    try {
      const res = await api.post(`/api/extras/comments/${id}`, {
        email: user.email,
        name: user.name,
        text: commentText,
      });
      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
    } catch {
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading place details...</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-black text-stone-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Place not found
        </h2>
        <p className="text-stone-400 text-sm mb-6">We couldn't find the place you're looking for.</p>
        <Link to="/explore" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full transition-all duration-200">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const isOwner = user?.email === place.email;

  return (
    <div className="min-h-screen bg-[#FFFBF5]">

      {/* ── Hero Image ── */}
      <div className="relative w-full h-72 md:h-[420px] overflow-hidden">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          to="/explore"
          className="absolute top-5 left-5 inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30 transition-all duration-200"
        >
          ← Back
        </Link>
        <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {place.views ?? 0} {place.views === 1 ? "view" : "views"}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg" style={{ fontFamily: "Georgia, serif" }}>
            {place.name}
          </h1>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">About this place</p>
            <p className="text-stone-600 text-base leading-relaxed">{place.description}</p>
          </div>
          {place.directionGuidance && (
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">
              <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">Direction Guidance</p>
              <p className="text-stone-600 text-base leading-relaxed">{place.directionGuidance}</p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-4">Location</p>
            <div className="flex flex-col gap-3">
              {place.city && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-400 font-medium">City</span>
                  <span className="text-sm font-bold text-stone-700">{place.city}</span>
                </div>
              )}
              {place.state && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-400 font-medium">State</span>
                  <span className="text-sm font-bold text-stone-700">{place.state}</span>
                </div>
              )}
              {place.location?.address && (
                <div className="flex flex-col gap-1 pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-400 font-medium">Detected Address</span>
                  <span className="text-xs text-stone-600">{place.location.address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">Added by</p>
            <p className="text-sm font-semibold text-stone-700">{place.email}</p>
          </div>
          <Link
            to="/explore"
            className="w-full text-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-md shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5"
          >
            ← Explore More Places
          </Link>
        </div>
      </div>

      {/* ── Other Images Section ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-10">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-1">Gallery</p>
              <h3 className="text-xl font-black text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
                Photos of this Place
              </h3>
            </div>
            {user ? (
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={imageUploading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-bold hover:bg-teal-100 transition-all duration-200 disabled:opacity-60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {imageUploading ? "Uploading..." : "Add Photo"}
              </button>
            ) : (
              <Link to="/login" className="text-sm text-orange-500 font-semibold hover:underline">
                Sign in to add photos
              </Link>
            )}
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
          </div>

          {imageError && <p className="text-red-400 text-sm mb-4">{imageError}</p>}

          {/* Grid */}
          {placeImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {placeImages.map((img) => (
                <div key={img._id} className="aspect-square rounded-xl overflow-hidden border border-stone-100">
                  <img src={img.imageUrl} alt="Place" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-stone-400 text-sm">No photos added yet. Be the first to share one.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Promotion Section ── */}
      {(promotion || isOwner) && (
  <div className="max-w-5xl mx-auto px-6 md:px-12 pb-10">
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-1">Promotion</p>
          <h3 className="text-xl font-black text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
            Featured Highlights
          </h3>
        </div>
        {isOwner && (
          <button
            onClick={() => { setShowPromoForm((prev) => !prev); setPromoError(""); setPromoSuccess(""); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-bold hover:bg-orange-100 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {promotion ? "Update Promotion" : "Add Promotion"}
          </button>
        )}
      </div>

      {promoSuccess && <p className="text-teal-600 text-sm mb-4 font-medium">{promoSuccess}</p>}

      {/* Promotion form */}
      {isOwner && showPromoForm && (
        <div className="mb-8 p-6 rounded-xl bg-orange-50/50 border border-orange-100">
          <p className="text-sm font-bold text-stone-700 mb-4">
            Add up to 5 promotional images and a description.
          </p>
          <div className="mb-4">
            <div
              onClick={() => promoImages.length < 5 && promoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${promoImages.length < 5 ? "border-orange-200 bg-white cursor-pointer hover:bg-orange-50" : "border-stone-100 bg-stone-50 cursor-not-allowed opacity-60"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-stone-400">
                {promoImages.length < 5 ? `Click to add images (${promoImages.length}/5)` : "Maximum 5 images reached"}
              </p>
            </div>
            <input ref={promoInputRef} type="file" accept="image/*" multiple onChange={handlePromoImagePick} className="hidden" />
          </div>
          {promoImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
              {promoImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-stone-100">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePromoImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <textarea
            value={promoDescription}
            onChange={(e) => setPromoDescription(e.target.value)}
            placeholder="Describe what makes this place special for travelers..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition resize-none mb-4"
          />
          {promoError && <p className="text-red-400 text-sm mb-3">{promoError}</p>}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePromoSubmit}
              disabled={promoUploading}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {promoUploading ? "Saving..." : "Save Promotion"}
            </button>
            <button
              onClick={() => { setShowPromoForm(false); setPromoImages([]); setPromoDescription(""); setPromoError(""); }}
              className="px-6 py-2.5 border border-stone-200 text-stone-500 font-bold text-sm rounded-full hover:bg-stone-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Promotion display */}
      {promotion && (
        <div>
          <div className={`grid gap-3 mb-6 ${promotion.images.length === 1 ? "grid-cols-1" : promotion.images.length === 2 ? "grid-cols-2" : promotion.images.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
            {promotion.images.map((img, i) => (
              <div key={i} className={`rounded-xl overflow-hidden border border-orange-100 ${promotion.images.length === 1 ? "h-64" : "aspect-square"}`}>
                <img src={img} alt={`Promotion ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
          <p className="text-stone-600 text-base leading-relaxed">{promotion.description}</p>
        </div>
      )}
    </div>
  </div>
)}

      {/* ── Comments Section ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">

          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-1">Discussion</p>
            <h3 className="text-xl font-black text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
              Traveler Comments
              {comments.length > 0 && (
                <span className="ml-2 text-sm font-bold text-stone-400">({comments.length})</span>
              )}
            </h3>
          </div>

          {/* Comment input — logged in only */}
          {user ? (
            <div className="mb-8 flex gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-black text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your experience of this place..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition resize-none mb-2"
                />
                {commentError && <p className="text-red-400 text-xs mb-2">{commentError}</p>}
                <button
                  onClick={handleCommentSubmit}
                  disabled={commentSubmitting || !commentText.trim()}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {commentSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 px-5 py-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <p className="text-sm text-stone-400 font-medium">Sign in to share your experience</p>
              <Link
                to="/login"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="flex flex-col divide-y divide-stone-50">
              {comments.map((comment) => (
                <div key={comment._id} className="py-5 flex gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-700 font-black text-sm">
                      {comment.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-stone-800">{comment.name}</span>
                      <span className="text-xs text-stone-300">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-stone-400 text-sm">No comments yet. Be the first to share your experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;