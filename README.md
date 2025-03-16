**Project Goal:**

Design and document a server-side web application (Movie/TV Show recommendation system) using PHP (backend), HTML5/CSS3, and JavaScript (frontend), targeting Google Chrome.  This is an *individual* project, and the focus of *this* assignment is the *design*, not the implementation.  You are *not* allowed to use generative AI.

**Deliverable:**

*   **ONE Technical Design Report (Word .docx format):** This document details the *design* of the application. Diagrams (PNG/JPEG) should be embedded within the Word document.

**Document Sections and Content:**

The report is broken down into these main sections, each with specific requirements:

1.  **Background Research (30% of grade):**

    *   **1.  1 Analysis of the TCP protocol and the TCP/IP model (15%):**
        *   Define TCP (acronym and layer).
        *   Explain how TCP works.
        *   Analyze TCP's characteristics and advantages.
        *   Compare TCP and UDP.
        *   Provide examples of TCP's use in applications.
        *   Present and explain the 4-layer TCP/IP model.
        *   Compare the 4-layer TCP/IP model to the OSI model.
        *   Include any other relevant technical details.
        * Use diagrams

    *   **2.  2 Existing Site Analysis (15%):**
        *   Critique *ONE* existing movie/TV show recommendation website (e.g., IMDb, TheMovieDB, Metacritic).  Describe:
            *   Key functionality.
            *   Usability (responsiveness, navigation, use of CSS/JavaScript).
            *   Search functionality.
            *   Review/rating features.

    *   **Word Count Guidance:** 1000-1500 words for the Background Research section, but this is *not* strict.
    *   **Support:** Use diagrams and data/code samples.

2.  **Server-Side Design (30% of grade):**

    *   **3.  1 Examples of the Class Data (10%):**
        *   Refer to the provided class diagram (Actor, Movie/TV Show, User, UserReview, ExternalReview).
        *   For *EACH* attribute/field in *EACH* class:
            *   Specify the data type.
            *   Provide *at least TWO* example data instances.  A table format is recommended (fields as columns, instances as rows).
        * Short Discription of the fileds are also provided

    *   **4.  2 Server-Side Logic Activity Diagram (10%):**
        *   Create an activity diagram showing the server-side workflow for generating the *individual movie/TV show details view*.  This view should include key facts, user/external reviews, scores, etc., and focus on the *highest-scoring* movie/TV show.

    *   **5.  3 Site Map (10%):**
        *   Describe how application functionality is divided across PHP pages.
        *   Explain the purpose of each page.
        *   Illustrate the link structure (how pages connect).
        *   Show examples of data transmitted via HTTP GET/POST requests between pages (if applicable).  The "Conceptual Web Site" template in Visio is recommended.

3.  **Client-Side Design (30% of grade):**

    *   Use wireframes (Pencil, Balsamiq, or similar).

    *   **6.  1 Application Master Page (10%):**
        *   Show the layout of common interface elements shared across pages.
        *   Include both mobile and desktop views.

    *   **7.  2 Navigation Systems (10%):**
        *   Present the navigation system(s) used in the application.
        *   Show which pages UI controls link to.

    *   **8.  3 Example Application Page Designs (10%):**
        *   Provide annotated wireframes for:
            *   The individual movie/TV show details view.
            *   The movie/TV shows ranking view.

    *   **Guidance:** Use annotated wireframes.

4. **Document Presentation (10%)**

**Application Requirements / Specification (What Your Design Must Address):**

This section defines the *functional requirements* your design must fulfill.  It's crucial to understand these requirements to create a correct design.

*   **Application Pages (Views):**  The application must include at least these views (which can be pages or parts of pages):

    *   **Home Page:**  Summary of at least *THREE* movies/TV shows, with links to:
        *   The streaming service overview page.
        *   Individual movie/TV show detail pages.
    *   **Individual Movie/TV Show View:**  For *each* recommended movie/TV show:
        *   Information (name, director, cast, release date, age rating, etc.).
        *   *ALL* user-contributed reviews.
    *   **Ranking View:** A table of all movies/TV shows, with:
        *   Key information.
        *   Your review score.
        *   Average user score.
    *   **Streaming Service Overview Page:** Information about the chosen streaming service.
    *   **Master Page/Common Layout:**  All views should be hyperlinked, using a master page or common layout with global navigation.

*   **Functional Requirements:**

    *   **Movie/TV Show Content:**  For *at least THREE* movies/TV shows (PG-13 or lower, released before the deadline):
        *   An editorial recommendation (your review).
        *   A recommendation score (out of 10, not necessarily unique).
        *   Key facts (director, release date, cast, duration, age rating, genre, etc. - *you* define the specific facts).
        *   Links to *THREE* "official" external reviews (e.g., IMDB, Metacritic).
        *   Support for *USER REVIEWS* (stored in a JSON file, not anonymous, requires login).
            *   User reviews must include a rating (out of 10).
    *   **User Profile System:**
        *   Users must log in with a username and password to *post reviews* (but *not* to view content).
        *   The logged-in user's name should be displayed.
        *   *Additional marks* for:
            *   Storing additional user information (email, etc.).
            *   Profile-specific features (favorite movie/show, displaying user's reviews).
    *   **Ranking System:**
        *   Displays all movies/TV shows in a table.
        *   Should include your Recommendation Score.
        *   *Additional marks* for informative and concise table design and for sorting by category/rating.
        *   You determine the overall rating calculation based on reviews.
    * **Streaming Serview Overview page:**
        * Information on the streaming services, prices, and availability
        * Use other content from different sources
        * Present in diffrent types of media.

**Key Reminders:**

*   **Focus on Design:** This assignment is about *designing* the application, *not* building it.
*   **Documentation:** Thoroughly document your design decisions.
*   **Diagrams:** Use diagrams extensively to illustrate your design.
*   **Wireframes:** Use wireframing tools for client-side design.
*   **No Generative AI:** You are not allowed to use AI tools.
*   **Reference Style:** Use the refrencing style which is use by your university

