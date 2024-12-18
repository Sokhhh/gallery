// swaggerGalleries.js

/**
 * @swagger
 * /api/galleries:
 *   post:
 *     summary: Create a new gallery
 *     tags: [Galleries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Gallery"
 *               description:
 *                 type: string
 *                 example: "A collection of my favorite images."
 *     responses:
 *       201:
 *         description: Gallery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries:
 *   get:
 *     summary: Get all galleries
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: A list of galleries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */

/**
 * @swagger
 * /api/galleries/{galleryId}:
 *   get:
 *     summary: Get a specific gallery by ID
 *     tags: [Galleries]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gallery found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Gallery not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}:
 *   put:
 *     summary: Update a specific gallery by ID
 *     tags: [Galleries]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Gallery Name"
 *               description:
 *                 type: string
 *                 example: "Updated description for the gallery."
 *     responses:
 *       200:
 *         description: Gallery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Gallery not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}:
 *   delete:
 *     summary: Delete a specific gallery by ID
 *     tags: [Galleries]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gallery deleted successfully
 *       404:
 *         description: Gallery not found
 *       500:
 *         description: Internal server error
 */