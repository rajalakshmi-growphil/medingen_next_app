/**
 * Cleans and normalizes strings for accurate search token matching.
 */
const cleanStr = (str) => (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Calculates a search relevance score for a product given a user query.
 * Higher scores indicate better match quality (exact matches, prefix matches, token alignment).
 * 
 * @param {Object} product - Product object containing product_name, name, salt_name, composition, etc.
 * @param {string} query - User search query string
 * @returns {number} Relevance score
 */
export const calculateRelevanceScore = (product, query) => {
    if (!query) return 0;

    const qClean = cleanStr(query);
    if (!qClean) return 0;

    const rawName = product.product_name || product.name || "";
    const rawSalt = product.salt_name || product.composition || "";

    const nameClean = cleanStr(rawName);
    const saltClean = cleanStr(rawSalt);

    if (!nameClean && !saltClean) return 0;

    let score = 0;

    // --- Product Name Matching ---
    if (nameClean) {
        // 1. Exact string match
        if (nameClean === qClean) {
            score += 100000;
        }
        // 2. Starts with full query string
        else if (nameClean.startsWith(qClean)) {
            score += 50000;
        }
        // 3. Contains full query string
        else if (nameClean.includes(qClean)) {
            score += 20000;
        }

        // 4. Token-level matching
        const qTokens = qClean.split(" ").filter(Boolean);
        const nameWords = nameClean.split(" ").filter(Boolean);

        let nameTokensMatched = 0;
        let exactWordMatches = 0;
        let prefixWordMatches = 0;

        qTokens.forEach((qTok) => {
            let matchedInName = false;
            nameWords.forEach((nWord) => {
                if (nWord === qTok) {
                    exactWordMatches++;
                    matchedInName = true;
                } else if (nWord.startsWith(qTok)) {
                    prefixWordMatches++;
                    matchedInName = true;
                }
            });
            if (!matchedInName && nameClean.includes(qTok)) {
                matchedInName = true;
            }
            if (matchedInName) {
                nameTokensMatched++;
            }
        });

        if (qTokens.length > 0) {
            const tokenMatchRatio = nameTokensMatched / qTokens.length;

            if (tokenMatchRatio === 1) {
                score += 30000;
                // Extra bonus if first word of query matches first word of product name
                if (nameWords.length > 0 && nameWords[0].startsWith(qTokens[0])) {
                    score += 10000;
                }
            } else {
                score += tokenMatchRatio * 5000;
            }

            score += exactWordMatches * 2000;
            score += prefixWordMatches * 1000;
        }

        // 5. Closeness in string length (prefer shorter/closer matched names)
        const lenDiff = Math.abs(nameClean.length - qClean.length);
        score += Math.max(0, 500 - lenDiff * 10);
    }

    // --- Salt / Composition Matching ---
    if (saltClean) {
        if (saltClean === qClean) {
            score += 8000;
        } else if (saltClean.startsWith(qClean)) {
            score += 4000;
        } else if (saltClean.includes(qClean)) {
            score += 2000;
        }

        const qTokens = qClean.split(" ").filter(Boolean);
        const saltWords = saltClean.split(" ").filter(Boolean);
        let saltTokensMatched = 0;

        qTokens.forEach((qTok) => {
            let matchedInSalt = false;
            saltWords.forEach((sWord) => {
                if (sWord === qTok || sWord.startsWith(qTok)) {
                    matchedInSalt = true;
                }
            });
            if (!matchedInSalt && saltClean.includes(qTok)) {
                matchedInSalt = true;
            }
            if (matchedInSalt) {
                saltTokensMatched++;
            }
        });

        if (qTokens.length > 0) {
            const saltMatchRatio = saltTokensMatched / qTokens.length;
            score += saltMatchRatio * 1000;
        }
    }

    return score;
};

/**
 * Sorts an array of product objects by search relevance score in descending order.
 * Also filters out weak matches when strong matches exist for multi-word queries.
 * 
 * @param {Array} results - List of product objects
 * @param {string} query - User search query
 * @returns {Array} Sorted and filtered list of products
 */
export const sortAndFilterSearchResults = (results, query) => {
    if (!Array.isArray(results) || results.length === 0) return [];
    if (!query || !query.trim()) return results;

    const scored = results.map((product) => ({
        product,
        score: calculateRelevanceScore(product, query)
    }));

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // If top scored item has strong match score (>= 20000), filter out items with weak score (< 10000)
    const topScore = scored[0]?.score || 0;
    let finalScored = scored;
    if (topScore >= 20000) {
        finalScored = scored.filter(item => item.score >= 10000);
    }

    return finalScored.map((item) => item.product);
};
