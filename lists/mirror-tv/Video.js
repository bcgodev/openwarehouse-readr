const {
    Text,
    Checkbox,
    Select,
    Relationship,
    File,
    Url,
} = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { GCSAdapter } = require('../../lib/GCSAdapter')
const {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const gcsDir = 'assets/videos/'
const NewDateTime = require('../../fields/NewDateTime/index.js')

module.exports = {
    fields: {
        title: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案',
            type: File,
            adapter: new GCSAdapter(gcsDir),
            isRequired: true,
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image',
        },
        description: {
            label: '敘述',
            type: Text,
            isMultiline: true,
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft',
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        isFeed: {
            label: '供稿',
            type: Checkbox,
            defaultValue: true,
        },
        meta: {
            label: '中繼資料',
            type: Text,
            access: {
                create: false,
                update: false,
            },
        },
        url: {
            label: '檔案網址',
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
        duration: {
            label: '影片長度（秒）',
            type: Number,
            access: {
                create: false,
                update: false,
            },
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'title, video, tags, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: ({
            operation,
            existingItem,
            resolvedData,
            originalInput,
        }) => {
            if (resolvedData.file) {
                resolvedData.meta = resolvedData.file._meta
                resolvedData.url = resolvedData.file._meta.url
                resolvedData.duration = resolvedData.file._meta.duration
            }
            return resolvedData
        },
    },
    labelField: 'title',
    cacheHint: cacheHint,
}
