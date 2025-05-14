<template>
    <div class="a-textarea-wrapper" @mouseenter="hovering = true" @mouseleave="hovering = false">
        <textarea ref="textareaRef" v-model="inputValue" class="a-textarea" :style="textareaStyle"
            @input="handleInput"></textarea>
        <span v-if="allowClear && inputValue" class="a-textarea-clear" @click="clearInput" v-show="hovering">×</span>
    </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    allowClear: {
        type: Boolean,
        default: false
    },
    autoSize: {
        type: [Boolean, Object],
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);
const textareaRef = ref(null);
const hovering = ref(false);

watch(() => props.modelValue, (val) => {
    inputValue.value = val;
    resizeTextarea();
});

watch(inputValue, (val) => {
    emit('update:modelValue', val);
    resizeTextarea();
});

const textareaStyle = ref({});

function resizeTextarea() {
    if (!props.autoSize || !textareaRef.value) return;

    const textarea = textareaRef.value;
    textarea.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || '20');
    const scrollHeight = textarea.scrollHeight;

    let minHeight = 0;
    let maxHeight = Infinity;

    if (typeof props.autoSize === 'object') {
        if (props.autoSize.minRows) minHeight = props.autoSize.minRows * lineHeight;
        if (props.autoSize.maxRows) maxHeight = props.autoSize.maxRows * lineHeight;
    }

    const height = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textareaStyle.value = {
        height: `${height}px`,
        overflowY: scrollHeight > maxHeight ? 'auto' : 'hidden'
    };
}

function clearInput() {
    inputValue.value = '';
}
</script>

<style scoped>
.a-textarea-wrapper {
    position: relative;
    width: 100%;
}

.a-textarea {
    width: 100%;
    min-height: 80px;
    padding: 8px 28px 8px 8px;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    resize: none;
    transition: border-color 0.3s;
}

.a-textarea:focus {
    outline: none;
    border-color: #1890ff;
}

.a-textarea-clear {
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
    font-size: 16px;
    color: #999;
    user-select: none;
}
</style>
