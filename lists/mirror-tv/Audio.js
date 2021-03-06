const { Text, Relationship, File, Url } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../../lib/GCSAdapter');
const { admin, moderator, editor, contributor, owner, allowRoles } = require('../../helpers/access/mirror-tv');
const cacheHint = require('../../helpers/cacheHint');

const gcsDir = 'assets/audios/';

module.exports = {
    fields: {
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir),
            isRequired: true,
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image'
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true
        },
        meta: {
            label: '中繼資料',
            type: Text,
            access: {
                create: false,
                update: false,
            }
        },
        url: {
            label: '檔案網址',
            type: Url,
            access: {
                create: false,
                update: false,
            }
        },
        duration: {
            label: '音檔長度（秒）',
            type: Number,
            access: {
                create: false,
                update: false,
            }
        }
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    hooks: {
    },
    adminConfig: {
        defaultColumns: 'title, audio, tags, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: ({ operation, existingItem, resolvedData, originalInput }) => {
            if (resolvedData.file) {
                resolvedData.meta = resolvedData.file._meta
                resolvedData.url = resolvedData.file._meta.url
                resolvedData.duration = resolvedData.file._meta.duration
            }
            return resolvedData
        },
    },
    plural: 'Audios',
    labelField: 'title',
    cacheHint: cacheHint,
}
