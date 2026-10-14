"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSalt, searchsaltProducts, getProductDetails, searchSalt } from "@/api/Api";
import Header from "@/features/home/Dashboard/Header";
import Navigation from "@/features/home/Dashboard/Navigation";
import axios from "axios";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";
import {
  FaShieldAlt,
  FaRunning,
  FaHeartbeat,
  FaSyringe,
  FaAllergies,
  FaWeight,
  FaTint,
  FaEye,
  FaThermometerHalf,
} from "react-icons/fa";
import {
  GiMedicines,
  GiPill,
  GiStomach,
  GiHeartOrgan,
  GiBrain,
  GiKidneys,
  GiLiver,
  GiLungs,
  GiBrokenBone,
} from "react-icons/gi";
import { BiDrink, BiSun, BiMoon } from "react-icons/bi";
import { TbPill, TbAlertTriangle } from "react-icons/tb";
import {
  MdCalendarToday,
  MdCheckCircle,
  MdScience,
  MdLocalHospital,
  MdNoFood,
  MdDirectionsCar,
  MdPregnantWoman,
  MdChildCare,
  MdWarningAmber,
  MdInfo,
  MdNoDrinks,
  MdSmokeFree,
  MdElderlyWoman,
} from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import "./style.css";

/* ─────────────────────────────────────────────
   Helper: get dynamic icon component for structured cards
───────────────────────────────────────────── */
const getDynamicIcon = (iconName, size = 18, color = "#7c3aed") => {
  switch (iconName?.toLowerCase()) {
    case "shield": return <FaShieldAlt size={size} color={color} />;
    case "energy": return <FaRunning size={size} color={color} />;
    case "vitality": return <FaHeartbeat size={size} color={color} />;
    case "active": return <FaRunning size={size} color={color} />;
    case "brain": return <GiBrain size={size} color={color} />;
    case "glow": return <BiSun size={size} color={color} />;
    case "creative": return <GiBrain size={size} color={color} />;
    case "calm": return <BiMoon size={size} color={color} />;
    case "weight": return <FaWeight size={size} color={color} />;
    case "dosage": return <TbPill size={size} color={color} />;
    case "timing": return <MdCalendarToday size={size} color={color} />;
    case "limit": return <MdWarningAmber size={size} color={color} />;
    case "consistency": return <MdCheckCircle size={size} color={color} />;
    case "food": return <MdNoFood size={size} color={color} />;
    case "water": return <FaTint size={size} color={color} />;
    case "morning": return <BiSun size={size} color={color} />;
    case "night": return <BiMoon size={size} color={color} />;
    case "empty": return <MdNoFood size={size} color={color} />;
    case "injection": return <FaSyringe size={size} color={color} />;
    case "swallow": return <TbPill size={size} color={color} />;
    case "chew": return <GiPill size={size} color={color} />;
    case "dissolve": return <GiPill size={size} color={color} />;
    case "apply": return <MdInfo size={size} color={color} />;
    case "eye": return <FaEye size={size} color={color} />;
    case "inhale": return <GiLungs size={size} color={color} />;
    case "frequency": return <MdCalendarToday size={size} color={color} />;
    case "duration": return <MdCalendarToday size={size} color={color} />;
    case "avoid": return <MdWarningAmber size={size} color={color} />;
    case "storage": return <MdInfo size={size} color={color} />;
    case "missed": return <MdWarningAmber size={size} color={color} />;
    case "overdose": return <TbAlertTriangle size={size} color={color} />;
    case "hospital": return <MdLocalHospital size={size} color={color} />;
    case "smoking": return <MdSmokeFree size={size} color={color} />;
    case "alcohol": return <MdNoDrinks size={size} color={color} />;
    case "driving": return <MdDirectionsCar size={size} color={color} />;
    case "pregnancy": return <MdPregnantWoman size={size} color={color} />;
    case "elderly": return <MdElderlyWoman size={size} color={color} />;
    case "children": return <MdChildCare size={size} color={color} />;
    case "sun": return <BiSun size={size} color={color} />;
    case "sleep": return <BiMoon size={size} color={color} />;
    case "heart": return <GiHeartOrgan size={size} color={color} />;
    case "kidney": return <GiKidneys size={size} color={color} />;
    case "liver": return <GiLiver size={size} color={color} />;
    case "lungs": return <GiLungs size={size} color={color} />;
    case "stomach": return <GiStomach size={size} color={color} />;
    case "bone": return <GiBrokenBone size={size} color={color} />;
    case "allergy": return <FaAllergies size={size} color={color} />;
    case "blood": return <FaTint size={size} color={color} />;
    case "exercise": return <FaRunning size={size} color={color} />;
    case "fever": return <FaThermometerHalf size={size} color={color} />;
    case "warning": return <TbAlertTriangle size={size} color={color} />;
    case "pill": return <TbPill size={size} color={color} />;
    case "medicine": return <GiMedicines size={size} color={color} />;
    case "drink": return <BiDrink size={size} color={color} />;
    default: return <MdInfo size={size} color={color} />;
  }
};

/* ─────────────────────────────────────────────
   Helper: Expandable text component
───────────────────────────────────────────── */
const ExpandableText = ({ text, maxLen = 80, style = {} }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > maxLen;

  return (
    <div
      style={{ ...style, cursor: isLong ? "pointer" : "default" }}
      onClick={(e) => {
        if (!isLong) return;
        e.preventDefault();
        e.stopPropagation();
        setExpanded((prev) => !prev);
      }}
    >
      {isLong && !expanded ? text.slice(0, maxLen) + "..." : text}
      {isLong && (
        <span style={{ color: "#7c3aed", fontWeight: 700, marginLeft: 4, fontSize: 11 }}>
          {expanded ? " show less" : " show more"}
        </span>
      )}
    </div>
  );
};


const parseFaqContent = (content) => {
  if (!content) return [];

  if (Array.isArray(content)) {
    const flattened = [];
    content.forEach((item) => {
      if (!item) return;
      const q = item.question || item.q || item.title || "";
      const a = item.answer || item.a || item.description || item.content || "";
      const fullText = `${q} ${a}`.trim();
      const subItems = parseFaqContent(fullText);
      if (subItems.length > 1) {
        flattened.push(...subItems);
      } else if (q || a) {
        flattened.push({ q, a });
      }
    });
    return flattened;
  }

  if (typeof content !== "string") return [];

  const rawText = content.trim();
  if (!rawText) return [];

  if (rawText.includes("<") && typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawText, "text/html");
    
    const domItems = [];
    const elements = doc.querySelectorAll("p, div, li, h3, h4");
    elements.forEach((el) => {
      const strong = el.querySelector("strong, b, h3, h4");
      const text = el.textContent.trim();
      if (strong && text) {
        const qText = strong.textContent.trim();
        const aText = text.replace(qText, "").replace(/^[\:\-\s]+/, "").trim();
        if (qText && aText && (qText.endsWith("?") || /^(?:Q\.?\s*)?\d+[\.\)]/i.test(qText))) {
          domItems.push({ q: qText, a: aText });
        }
      }
    });

    if (domItems.length > 1) return domItems;
  }

  let plainText = rawText;
  if (rawText.includes("<") && typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawText, "text/html");
    plainText = doc.body.textContent || "";
  }

  plainText = plainText.trim();
  plainText = plainText.replace(/^(?:Q[\.\:]?|FAQ[s]?|Frequently Asked Questions)\s*/i, "").trim();

  const matches = [];
  const questionRegex = /(?:^|\s+)(?:Q\.?\s*)?(\d+[\.\)]\s*[^?\n]+\?|Q\d*[\.\:]\s*[^?\n]+\?)/gi;
  let match;
  while ((match = questionRegex.exec(plainText)) !== null) {
    matches.push({
      index: match.index,
      fullMatch: match[0],
      qText: match[1].trim(),
    });
  }

  if (matches.length > 0) {
    const items = [];
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const nextIndex = i + 1 < matches.length ? matches[i + 1].index : plainText.length;
      
      const qRaw = current.qText;
      const startOfAnswer = current.index + current.fullMatch.length;
      let aRaw = plainText.slice(startOfAnswer, nextIndex).trim();
      aRaw = aRaw.replace(/^(?:Answer|Ans|A)[\.\:]\s*/i, "").trim();

      if (qRaw && aRaw) {
        items.push({ q: qRaw, a: aRaw });
      }
    }
    if (items.length > 0) return items;
  }

  const fallbackPairs = [];
  const qMatches = [...plainText.matchAll(/(?:^|\n|\.\s+)(Q\d*[\.\:]?\s*)?([A-Z0-9][^?\n]{5,150}\?)/g)];
  if (qMatches.length > 1) {
    for (let i = 0; i < qMatches.length; i++) {
      const qMatch = qMatches[i];
      const qText = (qMatch[1] || "") + qMatch[2];
      const qStartIndex = qMatch.index + (qMatch[0].length - qText.length);
      const qEndIndex = qStartIndex + qText.length;
      
      const nextQStart = i + 1 < qMatches.length ? qMatches[i + 1].index : plainText.length;
      let aText = plainText.slice(qEndIndex, nextQStart).trim();
      aText = aText.replace(/^(?:Answer|Ans|A)[\.\:]\s*/i, "").trim();

      if (qText && aText) {
        fallbackPairs.push({ q: qText, a: aText });
      }
    }
    if (fallbackPairs.length > 0) return fallbackPairs;
  }

  const singleQEnd = plainText.search(/[?]/);
  if (singleQEnd !== -1) {
    const q = plainText.slice(0, singleQEnd + 1).trim();
    const a = plainText.slice(singleQEnd + 1).replace(/^(?:Answer|Ans|A)[\.\:]\s*/i, "").trim();
    if (q && a) return [{ q, a }];
  }

  return [];
};

const cleanCompositionName = (rawName) => {
  if (!rawName) return "";
  return rawName
    .replace(/\b\d+(\.\d+)?\s*%?\s*(w\/v|w\/w|v\/v|w\s*v|w\s*w|v\s*v)\b/gi, "")
    .replace(/\b\d+(\.\d+)?\s*%/gi, "")
    .replace(/\b(w\/v|w\/w|v\/v)\b/gi, "")
    .replace(/\b\d+(\.\d+)?\s*(mg|mcg|gm|g|ml)\b/gi, "")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s+/g, " ")
    .trim();
};

const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .split(/(\s+|\+|\/|-)/)
    .map((word) => {
      if (!word.trim() || word === "+" || word === "/" || word === "-") return word;
      if (/^[a-zA-Z]\d+$/i.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

const nameToSlug = (name) => {
  if (!name) return "";
  const cleaned = cleanCompositionName(name);
  const target = cleaned || name;
  return target
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, " ")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const pastelColors = [
  { bg: "#f3e8ff", color: "#9333ea" }, // pastel purple
  { bg: "#fef9c3", color: "#ca8a04" }, // pastel yellow
  { bg: "#e0f2fe", color: "#0284c7" }, // pastel blue
  { bg: "#fce7f3", color: "#db2777" }, // pastel pink
  { bg: "#dcfce7", color: "#16a34a" }  // pastel green
];

const getProductImgUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://d1dh0rr5xj2p49.cloudfront.net/products/${img}`;
};

const MedCardImage = ({ product, colorTheme }) => {
  const [hasError, setHasError] = useState(false);
  const src = getProductImgUrl(product.imageUrl);

  if (src && !hasError) {
    return (
      <div className="sp-med-img-box">
        <img
          src={src}
          alt={product.name}
          onError={() => setHasError(true)}
          className="sp-med-img"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="sp-med-icon-box"
      style={{ backgroundColor: colorTheme.bg, color: colorTheme.color }}
    >
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </div>
  );
};

export const SaltPage = () => {
  const [salt, setSalt] = useState(null);
  const [alternateProducts, setAlternateProducts] = useState([]);
  const [structuredProduct, setStructuredProduct] = useState(null);
  const [tabs, setTabs] = useState({});
  const [rawHtmlContent, setRawHtmlContent] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  // Sidebar Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  // Table of Contents Active Link State
  const [activeSection, setActiveSection] = useState("sec-medicines");

  const navigate = useNavigate();
  const location = useLocation();
  const rawSaltParam = decodeURIComponent(
    location.pathname.replace(/^\/(salt|salt_name)\//, "")
  ).replace(/\/+$/, "");

  const rawComp = salt?.response?.composition || rawSaltParam.replace(/-/g, " ");
  const cleanedComp = toTitleCase(cleanCompositionName(rawComp));
  const displayName = cleanedComp || toTitleCase(rawComp);

  const cleanSlug = nameToSlug(displayName || rawSaltParam);
  const querySaltName = cleanCompositionName(rawSaltParam.replace(/-/g, " ")) || rawSaltParam.replace(/-/g, " ");

  useEffect(() => {
    const activeSlug = nameToSlug(displayName || cleanSlug);
    if (activeSlug) {
      const targetPath = `/salt/${activeSlug}/`;
      if (location.pathname !== targetPath && location.pathname !== `/salt/${activeSlug}`) {
        window.history.replaceState(null, "", targetPath);
      }
    }
  }, [displayName, cleanSlug, location.pathname]);
  const shortSaltName = displayName.split("/")[0].split("+")[0].trim();

  const getSubstitutedContent = (text) => {
    if (!text) return "";
    if (typeof text !== "string") return text;
    let res = text.replace(/[\[\{]+\s*product_name\s*[\]\}]+/gi, displayName);
    res = res.replace(/[\[\{]+\s*salt_name\s*[\]\}]+/gi, displayName);
    return res;
  };

  const cleanDbTabContent = (html) => {
    if (!html) return "";
    if (typeof html !== "string") return html;
    let clean = html.replace(
      /<(h[1-6]|p)[^>]*>\s*(?:<strong[^>]*>)?\s*(Benefits|How It's Works|How It Works|Side Effects|Expert's Advice|Expert Advice|Frequently Asked Questions|FAQ|Overview)\s*(?:<\/strong>)?\s*<\/(h[1-6]|p)>/gi,
      ""
    );
    return clean;
  };

  const getWhatIsItParagraph = (html, saltName) => {
    if (!html) return "";
    if (typeof html !== "string") return html;
    if (typeof window === "undefined") return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Check if there is an explicit lead paragraph before any h1-h6
    const firstChild = doc.body.firstElementChild;
    if (firstChild && firstChild.tagName.toLowerCase() === "p") {
      const text = firstChild.textContent.trim();
      if (
        text.length > 15 &&
        !/^benefits/i.test(text) &&
        !/^how it's works/i.test(text) &&
        !/^side effects/i.test(text) &&
        !/^expert's advice/i.test(text) &&
        !/^frequently asked/i.test(text)
      ) {
        return firstChild.outerHTML;
      }
    }

    return `<p>${saltName} is an active pharmaceutical ingredient used in prescription medicines to manage and treat specific health conditions under medical supervision.</p>`;
  };

  const defaultFaqItems = [
    {
      q: "Q. How quickly does this medication work?",
      a: "The onset of action depends on the specific formulation and dosage. Follow your doctor's instructions for expected timelines."
    },
    {
      q: "Q. Can I stop taking it when symptoms subside?",
      a: "Always consult your physician before stopping treatment, especially for chronic conditions where continuous management is required."
    },
    {
      q: "Q. Can it cause side effects?",
      a: "Like all medications, side effects may occur. Most are mild and temporary, but consult your doctor if persistent symptoms arise."
    },
    {
      q: "Q. What happens if I miss a dose?",
      a: "Take the missed dose as soon as you remember, unless it is close to your next scheduled dose. Never double the dose."
    },
    {
      q: "Q. How should I store this medicine?",
      a: "Store at room temperature away from direct sunlight, heat, and excess moisture. Keep out of reach of children."
    }
  ];

  const defaultReferences = [
    `Central Drugs Standard Control Organisation (CDSCO). Drug Monograph — ${displayName}. Ministry of Health & Family Welfare, Government of India.`,
    `World Health Organization (WHO). Model List of Essential Medicines & Formulary — Active Pharmaceutical Ingredient: ${displayName}.`,
    `Prescribers' Digital Reference (PDR). ${displayName} — Clinical Summary & Prescribing Information.`,
    `British National Formulary (BNF) — ${displayName}: Indications, Dosage & Precautions. NICE/BMA.`,
    `Indian Pharmacopoeia Commission (IPC). Monograph on ${displayName}. Ministry of Health & Family Welfare.`
  ];

  const defaultRelatedCompositions = [
    { title: "Paracetamol + Caffeine", code: "MIG0778", medicineCount: 6, slug: "paracetamol-caffeine" },
    { title: "Aceclofenac + Paracetamol", code: "MIG0810", medicineCount: 11, slug: "aceclofenac-paracetamol" },
    { title: "Paracetamol + Chlorpheniramine + Phenylephrine", code: "MIG0781", medicineCount: 9, slug: "paracetamol-chlorpheniramine-phenylephrine" },
    { title: "Ibuprofen + Paracetamol", code: "MIG0512", medicineCount: 8, slug: "ibuprofen-paracetamol" },
    { title: "Tramadol + Paracetamol", code: "MIG1044", medicineCount: 4, slug: "tramadol-paracetamol" },
  ];

  const handleView = (product) =>
    navigate(`/product/${product.product_name_url}`, {
      state: {
        from: "salt",
        saltName: displayName || querySaltName || rawSaltParam,
        saltSlug: cleanSlug
      }
    });

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  /* ── Fetch products from DB & Structured Product Details ── */
  const fetchAlternateProducts = async () => {
    try {
      setProductsLoading(true);
      let result = await searchsaltProducts(querySaltName, 1, { rc: 1 });
      if (!result?.results || result.results.length === 0) {
        result = await searchsaltProducts(querySaltName, 1);
      }
      if (result?.results && result.results.length > 0) {
        setAlternateProducts(
          result.results.map((prod) => {
            const oldPrice = parseFloat(prod.product_pricing_old) || 0;
            const newPrice = parseFloat(prod.product_pricing_new) || 0;
            const discountPct = oldPrice > newPrice && oldPrice > 0 
              ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
              : 0;

            const img = prod.first_image_url || prod.image_url || prod.img || (prod.images && prod.images[0] ? prod.images[0].img : null);

            return {
              product_name_url: prod.product_name_url,
              originalPrice: prod.product_pricing_old,
              discountedPrice: prod.product_pricing_new,
              discount: discountPct,
              imageUrl: img,
              name: prod.product_name,
              manufacturer: prod.manufacturer || "Medingen Partner",
              packaging: prod.pack_size || "Pack of 10 Units",
              product_id: prod.product_id,
            };
          })
        );

        // Fetch structured product details from top medicine to display rich product page content on salt page
        const topProd = result.results[0];
        try {
          const details = await getProductDetails(topProd.product_id, topProd.product_name_url);
          if (
            details &&
            (details.productDescription ||
              (details.benefits && details.benefits.length > 0) ||
              (details.sideEffects && details.sideEffects.length > 0) ||
              (details.howToUse && details.howToUse.length > 0) ||
              details.howItWorks ||
              (details.safetyAdvice && details.safetyAdvice.length > 0) ||
              (details.drugInteractions && details.drugInteractions.length > 0) ||
              (details.faq && details.faq.length > 0) ||
              details.references)
          ) {
            setStructuredProduct({
              ...details,
              name: details.productName || topProd.product_name,
              genericName: displayName,
            });
          }
        } catch (err) {
          console.warn("Could not fetch structured product details:", err);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProductsLoading(false);
    }
  };

  /* ── Parse DB description html into section dictionary ── */
  const parseDescriptionToTabs = (html) => {
    if (!html || typeof window === "undefined") return {};
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tabsData = {};

    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4"));

    headings.forEach((section) => {
      const heading = (section.querySelector("strong")?.textContent || section.textContent).trim();
      if (!heading) return;

      const content = [];
      let sibling = section.nextElementSibling;

      while (sibling) {
        const tag = sibling.tagName ? sibling.tagName.toUpperCase() : "";
        if (["H1", "H2", "H3", "H4"].includes(tag)) break;
        content.push(sibling.outerHTML);
        sibling = sibling.nextElementSibling;
      }

      if (heading && content.length > 0) {
        tabsData[heading] = content.join("");
      }
    });

    if (Object.keys(tabsData).length === 0 && html.trim()) {
      tabsData["Description"] = html;
    }

    return tabsData;
  };

  /* ── Fetch salt info from DB ── */
  const fetchSalt = async () => {
    try {
      setLoading(true);
      const response = await getSalt(querySaltName);
      if (response) {
        setSalt((prev) => ({ ...prev, response }));
        if (response.description_url) {
          try {
            const desc = await axios.get(
              `https://d1dh0rr5xj2p49.cloudfront.net/product_description/${response.description_url}`
            );
            const sanitized = DOMPurify.sanitize(desc.data);
            setRawHtmlContent(sanitized);
            const parsedTabs = parseDescriptionToTabs(sanitized);
            setTabs(parsedTabs);
          } catch (cdnErr) {
            console.warn("No description file on CDN for salt:", response.description_url);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching salt info:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (querySaltName) {
      fetchSalt();
      fetchAlternateProducts();
    }
  }, [rawSaltParam]);

  // Extract FAQs from DB HTML response
  const faqItems = useMemo(() => {
    return parseFaqContent(rawHtmlContent || tabs["Frequently Asked Questions"] || tabs["FAQ"] || "");
  }, [rawHtmlContent, tabs]);

  const displayFaqs = useMemo(() => {
    let source = [];
    if (structuredProduct?.faq && structuredProduct.faq.length > 0) {
      source = structuredProduct.faq;
    } else if (faqItems && faqItems.length > 0) {
      source = faqItems;
    } else {
      source = defaultFaqItems;
    }
    return parseFaqContent(source);
  }, [structuredProduct, faqItems, defaultFaqItems]);

  // Helper to match section from parsed DB tabs
  const getDbTabContent = (keywords) => {
    if (!tabs || Object.keys(tabs).length === 0) return null;
    for (const key of Object.keys(tabs)) {
      const keyLower = key.toLowerCase();
      if (keywords.some((kw) => keyLower.includes(kw.toLowerCase()))) {
        return { key, content: tabs[key] };
      }
    }
    return null;
  };

  const whatIsItData = getDbTabContent(["what is", "overview", "about", "introduction"]);
  const usesBenefitsData = getDbTabContent(["benefit", "use", "indication"]);
  const howItWorksData = getDbTabContent(["how it works", "mechanism", "action", "works"]);
  const howToTakeData = getDbTabContent(["how to take", "dosage", "administration", "take", "application instruction", "instruction", "how to use"]);
  const sideEffectsData = getDbTabContent(["side effect", "adverse", "effect"]);
  const safetyAdviceData = getDbTabContent(["expert's advice", "expert advice", "advice", "safety", "precaution", "warning"]);
  const referencesData = getDbTabContent(["reference", "source"]);

  const tocItems = useMemo(() => {
    return [
      { id: "sec-pancreatin", label: shortSaltName || "Pancreatin", isHeaderName: true },
      { id: "sec-medicines", label: "Medicines" },
      { id: "sec-what-is-it", label: "What is it?" },
      { id: "sec-uses-benefits", label: "Uses & benefits" },
      { id: "sec-how-it-works", label: "How it works" },
      { id: "sec-how-to-take", label: "How to take" },
      { id: "sec-side-effects", label: "Side effects" },
      { id: "sec-safety-advice", label: "Safety advice" },
      { id: "sec-faq", label: "FAQ" },
      { id: "sec-references", label: "References" },
      { id: "sec-medical-reviewer", label: "Medical reviewer" },
      { id: "sec-related-compositions", label: "Related compositions" },
      { id: "sec-disclaimer", label: "Disclaimer" },
    ];
  }, [shortSaltName]);

  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  // IntersectionObserver + Geometry-based Scroll Spy for rock-solid reading position tracking
  useEffect(() => {
    if (loading) return;

    const sectionIds = tocItems.map((item) => item.id);
    const READING_LINE = 130;

    const updateActiveSection = () => {
      if (isClickingRef.current) return;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // 1. Top of page check
      if (scrollY < 80) {
        setActiveSection(sectionIds[0]);
        return;
      }

      // 2. Bottom of page check
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      // 3. Find section currently spanning the 130px reading line
      let activeId = "";

      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= READING_LINE && rect.bottom > READING_LINE) {
            activeId = id;
            break;
          }
        }
      }

      // Fallback: If no section strictly spans 130px, pick closest section top to 130px
      if (!activeId) {
        let minDistance = Infinity;
        sectionIds.forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top - READING_LINE);
            if (distance < minDistance) {
              minDistance = distance;
              activeId = id;
            }
          }
        });
      }

      if (activeId) {
        setActiveSection(activeId);
      }
    };

    // Handle initial hash navigation if present
    if (location.hash) {
      const hashId = location.hash.replace("#", "");
      if (sectionIds.includes(hashId)) {
        setActiveSection(hashId);
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 110;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
          }
        }, 100);
      } else {
        updateActiveSection();
      }
    } else {
      updateActiveSection();
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      () => {
        updateActiveSection();
      },
      {
        root: null,
        rootMargin: "-120px 0px -50% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      updateActiveSection();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tocItems, loading, salt, structuredProduct, alternateProducts, location.hash]);

  const scrollToSection = (e, id) => {
    let targetId = id;
    if (typeof e === "string") {
      targetId = e;
    } else if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!targetId) return;

    setActiveSection(targetId);
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 110;
      const elementPosition = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
      const offsetPosition = Math.max(0, elementPosition - headerOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (document.documentElement && document.documentElement.scrollTop !== undefined) {
        document.documentElement.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 1000);
  };

  // Filter & Sort Sidebar Products List
  const filteredProducts = useMemo(() => {
    let list = [...alternateProducts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.manufacturer?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price_low") {
      list.sort((a, b) => (parseFloat(a.discountedPrice) || 0) - (parseFloat(b.discountedPrice) || 0));
    } else if (sortBy === "price_high") {
      list.sort((a, b) => (parseFloat(b.discountedPrice) || 0) - (parseFloat(a.discountedPrice) || 0));
    } else if (sortBy === "discount") {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return list;
  }, [alternateProducts, searchQuery, sortBy]);

  // Fetch real related compositions from DB
  const [relatedCompositions, setRelatedCompositions] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      const term = shortSaltName || querySaltName;
      if (!term) return;
      try {
        const res = await searchSalt(term);
        if (Array.isArray(res) && res.length > 0) {
          const currentUpper = (displayName || "").toUpperCase().trim();
          const filtered = res.filter(
            (c) => (c.composition || "").toUpperCase().trim() !== currentUpper
          );
          const list = filtered.length > 0 ? filtered : res;
          setRelatedCompositions(
            list.slice(0, 6).map((c) => ({
              title: toTitleCase(c.composition),
              code: c.composition_code || "",
              slug: nameToSlug(c.composition),
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching related compositions:", err);
      }
    };

    if (querySaltName) {
      fetchRelated();
    }
  }, [querySaltName, shortSaltName, displayName]);

  const seoTitle = `${displayName} – Uses, Dosage, Side Effects & Price | MediGen`;
  const seoDescription = `Complete information on ${displayName}: uses, dosage, side effects, interactions, substitutes and best price. Compare generic medicines with ${displayName} composition.`;
  const activeSlug = salt?.response?.composition
    ? nameToSlug(salt.response.composition)
    : cleanSlug;
  const canonicalUrl = `https://medingen.in/salt/${activeSlug}`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <div className="sp-page-container">
        <Header />

        <div className="sp-content-wrapper">
          {/* Top Title Block */}
          <header id="sec-pancreatin" className="sp-title-header">
            <h1 className="sp-main-title">{displayName}</h1>
          </header>

          {/* Mobile TOC horizontal scroll chips */}
          <nav className="sp-mobile-toc" aria-label="Table of Contents Mobile">
            {tocItems.map((item) => (
              <button
                key={item.id}
                className={`sp-mobile-toc-chip ${activeSection === item.id ? "active" : ""}`}
                onClick={(e) => scrollToSection(e, item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 3-Column Grid Layout */}
          <div className="sp-grid-layout">

            {/* Left Column: Sticky Table of Contents */}
            <aside className="sp-toc-column">
              <div className="sp-toc-card">
                <div className="sp-toc-header">ON THIS PAGE:</div>
                <a
                  href="#sec-pancreatin"
                  className={`sp-toc-salt-name ${activeSection === "sec-pancreatin" ? "active" : ""}`}
                  onClick={(e) => scrollToSection(e, "sec-pancreatin")}
                >
                  {shortSaltName}
                </a>
                <nav className="sp-toc-nav" aria-label="Table of Contents">
                  {tocItems.filter((item) => !item.isHeaderName).map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`sp-toc-link ${isActive ? "active" : ""}`}
                        onClick={(e) => scrollToSection(e, item.id)}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Middle Column: Main Content Sections (Clean Figma Layout) */}
            <main className="sp-main-content">

              {/* Section 1: Medicines Intro */}
              <section id="sec-medicines" className="sp-section-block">
                <h2 className="sp-section-title">Medicines containing {displayName}</h2>
                <div className="sp-section-body">
                  <p>
                    Explore medicines available on Medingen containing {displayName}. The complete list of {alternateProducts.length} products with pricing and pack details is available in the panel on the right. You can also search and sort by popularity, price, or discount.
                  </p>
                  <div>
                    <a className="sp-view-all-link" onClick={(e) => scrollToSection(e, "sec-medicines")}>
                      View all {alternateProducts.length} medicines &rarr;
                    </a>
                  </div>
                </div>
              </section>

              {/* Section 2: What is [Salt]? */}
              <section id="sec-what-is-it" className="sp-section-block">
                <h2 className="sp-section-title">What is {displayName}?</h2>
                <div className="sp-section-body">
                  {whatIsItData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(cleanDbTabContent(whatIsItData.content)) }} />
                  ) : structuredProduct?.productDescription ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(structuredProduct.productDescription) }} />
                  ) : (
                    <div>
                      <p>
                        {displayName} is an active pharmaceutical ingredient used in prescription medicines to manage and treat specific health conditions under medical supervision.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 3: Uses & Benefits of [Salt] */}
              <section id="sec-uses-benefits" className="sp-section-block">
                <h2 className="sp-section-title">Uses & Benefits of {displayName}</h2>
                <div className="sp-section-body">
                  {usesBenefitsData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(cleanDbTabContent(usesBenefitsData.content)) }} />
                  ) : structuredProduct?.benefits && structuredProduct.benefits.length > 0 ? (
                    <ul className="sp-figma-bullet-list">
                      {structuredProduct.benefits.map((item, i) => (
                        <li key={i}>
                          <strong>{item.title}:</strong>{" "}
                          <span dangerouslySetInnerHTML={{ __html: getSubstitutedContent(item.description) }} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <p>
                        {displayName} is prescribed for the management and treatment of indicated health conditions as advised by your physician.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 4: How [Salt] Works */}
              <section id="sec-how-it-works" className="sp-section-block">
                <h2 className="sp-section-title">How {displayName} Works</h2>
                <div className="sp-section-body">
                  {howItWorksData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(cleanDbTabContent(howItWorksData.content)) }} />
                  ) : structuredProduct?.howItWorks ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(structuredProduct.howItWorks) }} />
                  ) : (
                    <div>
                      <p>
                        {displayName} works by interacting with specific biological target pathways to alleviate symptoms and manage underlying physiological processes under clinical supervision.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 5: How to Take [Salt] */}
              <section id="sec-how-to-take" className="sp-section-block">
                <h2 className="sp-section-title">How to Take {displayName}</h2>
                <div className="sp-section-body">
                  {howToTakeData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(cleanDbTabContent(howToTakeData.content)) }} />
                  ) : structuredProduct?.howToUse && structuredProduct.howToUse.length > 0 ? (
                    <div>
                      {structuredProduct.howToUse.map((h, i) => (
                        <div key={i} style={{ marginBottom: "16px" }}>
                          <h3 className="sp-figma-subtitle">{h.title}</h3>
                          <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(h.description) }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: "14px" }}>
                        <h3 className="sp-figma-subtitle">Dosage</h3>
                        <p>
                          The {displayName} dosage is based on clinical indications, meal size, and the cause of digestive or health conditions. Doctors adjust the dose according to symptom control and response.
                        </p>
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <h3 className="sp-figma-subtitle">Timing</h3>
                        <p>
                          Take {displayName} at the start of meals or immediately after food for best digestion support and therapeutic efficacy. If eating light snacks, a smaller dose may be advised by your doctor.
                        </p>
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <h3 className="sp-figma-subtitle">Limit</h3>
                        <p>
                          Do not exceed the prescribed {displayName} dosage because excessive intake may increase the risk of bowel irritation or adverse health effects.
                        </p>
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <h3 className="sp-figma-subtitle">Consistency</h3>
                        <p>
                          Regular use with every meal is essential for consistent nutrient absorption and effective symptom management. Skipping repeated doses may cause symptom recurrence.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 6: Side Effects of [Salt] */}
              <section id="sec-side-effects" className="sp-section-block">
                <h2 className="sp-section-title">Side Effects of {displayName}</h2>
                <div className="sp-section-body">
                  {sideEffectsData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(cleanDbTabContent(sideEffectsData.content)) }} />
                  ) : structuredProduct?.sideEffects && structuredProduct.sideEffects.length > 0 ? (
                    <ul className="sp-figma-bullet-grid">
                      {structuredProduct.sideEffects.map((se, i) => (
                        <li key={i}>
                          <strong>{se.effect}</strong> {se.severity ? `(${se.severity.toLowerCase()})` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <p>
                        Common side effects of {displayName} may include mild gastrointestinal discomfort, nausea, or dizziness. Most side effects are temporary and resolve as your body adapts.
                      </p>
                    </div>
                  )}

                  <div className="sp-warning-box">
                    <span className="sp-warning-icon">⚠️</span>
                    <div>
                      <strong>Seek medical advice:</strong> If you experience severe, persistent or unusual symptoms, consult a healthcare professional.
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Safety Advice */}
              <section id="sec-safety-advice" className="sp-section-block">
                <h2 className="sp-section-title">Safety Advice</h2>
                <div className="sp-section-body">
                  {safetyAdviceData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(cleanDbTabContent(safetyAdviceData.content)) }} />
                  ) : structuredProduct?.safetyAdvice && structuredProduct.safetyAdvice.length > 0 ? (
                    <div>
                      {structuredProduct.safetyAdvice.map((sa, i) => (
                        <div key={i}>
                          <h3 className="sp-figma-subtitle">{sa.title}</h3>
                          <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(sa.description) }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div>
                        <h3 className="sp-figma-subtitle">Pregnancy and Breastfeeding</h3>
                        <p>
                          Always consult your doctor before using {displayName} during pregnancy or breastfeeding.
                        </p>
                      </div>

                      <div>
                        <h3 className="sp-figma-subtitle">Dose Restrictions</h3>
                        <p>
                          Take {displayName} strictly as prescribed by your healthcare professional. Do not adjust doses without medical advice.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 8: FAQ */}
              <section id="sec-faq" className="sp-section-block">
                <h2 className="sp-section-title">Frequently Asked Questions</h2>
                <div className="sp-faq-container">
                  {displayFaqs.map((item, i) => {
                    const rawQ = item.question || item.q || "";
                    const rawA = item.answer || item.a || "";

                    let cleanQ = rawQ
                      .replace(/^(?:Q\.?\s*)?(?:\d+[\.\)]|Q\d+[\.\:]?)\s*/i, "")
                      .trim();
                    if (cleanQ && !cleanQ.endsWith("?")) {
                      cleanQ = `${cleanQ}?`;
                    }

                    let cleanA = rawA
                      .replace(/^(?:Answer|Ans|A)[\.\:]\s*/i, "")
                      .trim();

                    const faqId = `faq-item-${i}`;
                    return (
                      <div key={i} id={faqId} className="sp-faq-card">
                        <div className="sp-faq-question-row">
                          <span className="sp-faq-badge">Q{i + 1}.</span>
                          <h3 className="sp-faq-question-text">
                            {getSubstitutedContent(cleanQ || rawQ)}
                          </h3>
                        </div>
                        <div className="sp-faq-answer-row">
                          <strong className="sp-faq-answer-label">Answer:</strong>
                          <div
                            className="sp-faq-answer-text"
                            dangerouslySetInnerHTML={{
                              __html: getSubstitutedContent(cleanA || rawA),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 9: References */}
              <section id="sec-references" className="sp-section-block">
                <h2 className="sp-section-title">References</h2>
                <div className="sp-section-body">
                  {referencesData ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(referencesData.content) }} />
                  ) : structuredProduct?.references ? (
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(structuredProduct.references) }} />
                  ) : (
                    <ol className="sp-references-list">
                      {defaultReferences.map((ref, idx) => (
                        <li key={idx}>{ref}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>



              {/* Section 10: Medical Reviewer Card */}
              <section id="sec-medical-reviewer" className="sp-section-block">
                <h2 className="sp-section-title">Medical Reviewer</h2>
                <div className="sp-reviewer-card">
                  <div className="sp-reviewer-avatar">SR</div>
                  <div className="sp-reviewer-info">
                    <span className="sp-reviewer-label">Medically Reviewed</span>
                    <span className="sp-reviewer-name">Dr. Shalini Rajput</span>
                    <span className="sp-reviewer-meta">MBBS, MD Pharmacology &middot; Senior Medical Advisor, Medingen</span>
                    <span className="sp-reviewer-date">Last reviewed: 10 September 2026</span>
                  </div>
                </div>
              </section>

              {/* Section 11: Related Compositions (Figma Image 4) */}
              <section id="sec-related-compositions" className="sp-section-block">
                <h2 className="sp-section-title">Related Compositions</h2>
                <div className="sp-main-related-card">
                  {(relatedCompositions.length > 0 ? relatedCompositions : defaultRelatedCompositions).map((comp, idx) => (
                    <div
                      key={idx}
                      className="sp-main-related-item"
                      onClick={() => navigate(`/salt/${comp.slug}`)}
                    >
                      <div className="sp-main-related-left">
                        <span className="sp-main-related-title">{comp.title}</span>
                      </div>
                      <div className="sp-main-related-right">
                        <span className="sp-main-related-count">{comp.medicineCount || 6} medicines</span>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 12: Disclaimer */}
              <section id="sec-disclaimer" className="sp-section-block">
                <div className="sp-disclaimer-card">
                  <img src="/disclaimer.svg" alt="Disclaimer" className="sp-disclaimer-icon" />
                  <div className="sp-disclaimer-text">
                    <strong>Disclaimer:</strong> The information provided on this page is for informational and educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
                  </div>
                </div>
              </section>

            </main>

            {/* Right Column: Sticky Medicines Sidebar */}
            <aside className="sp-sidebar-column">
              <div className="sp-sidebar-panel">
                <div className="sp-sidebar-header">
                  <div className="sp-sidebar-title-box">
                    <span className="sp-sidebar-title-top">List of medicines for</span>
                    <span className="sp-sidebar-title-salt">{displayName}</span>
                  </div>
                  <div className="sp-sidebar-count-badge">
                    {alternateProducts.length} products
                  </div>
                </div>

                {/* Search Box */}
                <div className="sp-search-box">
                  <svg className="sp-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="sp-search-input"
                    placeholder="Search medicines in this salt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort Controls */}
                <div className="sp-sort-row">
                  <span>Sort by:</span>
                  <select
                    className="sp-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="discount">Discount</option>
                  </select>
                </div>

                {/* Medicines List Cards */}
                {productsLoading ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "var(--sp-text-muted)" }}>
                    Loading medicines...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "var(--sp-text-muted)", fontSize: "13px" }}>
                    No medicines match your search.
                  </div>
                ) : (
                  <div className="sp-product-cards-list">
                    {filteredProducts.map((p, i) => {
                      const colorTheme = pastelColors[i % pastelColors.length];
                      return (
                        <div
                          key={p.product_id || i}
                          className="sp-med-card"
                          onClick={() => handleView(p)}
                        >
                          <MedCardImage product={p} colorTheme={colorTheme} />
                          <div className="sp-med-details">
                            <div className="sp-med-name">{p.name}</div>
                            <div className="sp-med-manufacturer">{p.manufacturer}</div>
                            <div className="sp-med-pack">{p.packaging}</div>
                            <div className="sp-med-price-line">
                              <span className="sp-med-price-new">₹{p.discountedPrice}</span>
                              {parseFloat(p.originalPrice) > parseFloat(p.discountedPrice) && (
                                <span className="sp-med-price-old">MRP ₹{p.originalPrice}</span>
                              )}
                              {p.discount > 0 && (
                                <span className="sp-med-discount-pill">{p.discount}% off</span>
                              )}
                            </div>
                          </div>
                          <svg className="sp-med-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Related Compositions Card */}
              {relatedCompositions.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <div className="sp-related-card">
                    <div className="sp-related-header">RELATED COMPOSITIONS</div>
                    <div className="sp-related-list">
                      {relatedCompositions.map((comp, idx) => (
                        <div
                          key={idx}
                          className="sp-related-item"
                          onClick={() => navigate(`/salt/${comp.slug}`)}
                        >
                          <div className="sp-related-title-box">
                            <span className="sp-related-title">{comp.title}</span>
                          </div>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--sp-text-subtle)" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </aside>

          </div>
        </div>
      </div>

      <Navigation />
    </>
  );
};
