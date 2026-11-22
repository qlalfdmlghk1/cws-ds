import './styles/index.css';

export { AppButton, type AppButtonProps } from './components/AppButton/AppButton';
export { AppIconButton, type AppIconButtonProps } from './components/AppIconButton/AppIconButton';
export { AppTooltip, type AppTooltipProps } from './components/AppTooltip/AppTooltip';
export { AppTextInput, type AppTextInputProps } from './components/AppTextInput/AppTextInput';
export { AppTextarea, type AppTextareaProps } from './components/AppTextarea/AppTextarea';
export { AppCheckbox, type AppCheckboxProps } from './components/AppCheckbox/AppCheckbox';
export { AppRadio, AppRadioGroup, type AppRadioProps, type AppRadioGroupProps, type RadioGroupOption } from './components/AppRadio/AppRadio';
export { AppCheckGroup, type AppCheckGroupProps, type CheckGroupOption } from './components/AppCheckGroup/AppCheckGroup';
export { AppSwitch, type AppSwitchProps } from './components/AppSwitch/AppSwitch';
export { AppSelect, type AppSelectProps, type SelectOption } from './components/AppSelect/AppSelect';
export { AppMultiSelect, type AppMultiSelectProps } from './components/AppMultiSelect/AppMultiSelect';
export { AppCalendar, type AppCalendarProps } from './components/AppDatepicker/AppCalendar';
export { AppDatepicker, datePresets, type AppDatepickerProps, type DatePreset } from './components/AppDatepicker/AppDatepicker';
export { AppModal, AppConfirmModal, type AppModalProps, type AppConfirmModalProps } from './components/AppModal/AppModal';
export { AppToast, AppToastProvider, useToast, type AppToastProps, type AppToastProviderProps, type ToastOptions, type ToastTone, type ToastAction } from './components/AppToast/AppToast';
export { AppCard, AppCardHeader, AppCardBody, AppCardFooter, AppStatCard, type AppCardProps, type AppCardHeaderProps, type AppStatCardProps, type StatDelta } from './components/AppCard/AppCard';
export { AppTabs, type AppTabsProps, type TabItem } from './components/AppTabs/AppTabs';
export { AppTable, type AppTableProps, type TableColumn, type TableSort } from './components/AppTable/AppTable';
export { AppBadge, type AppBadgeProps } from './components/AppBadge/AppBadge';
export { AppPagination, type AppPaginationProps } from './components/AppPagination/AppPagination';
export { AppChip, type AppChipProps } from './components/AppChip/AppChip';
export { AppDropdownMenu, type AppDropdownMenuProps, type MenuItem } from './components/AppDropdownMenu/AppDropdownMenu';
export { AppPopover, type AppPopoverProps } from './components/AppPopover/AppPopover';
export { AppAvatar, AppAvatarGroup, type AppAvatarProps, type AppAvatarGroupProps } from './components/AppAvatar/AppAvatar';
export { AppSkeleton, type AppSkeletonProps } from './components/AppSkeleton/AppSkeleton';
export type { DateKey, DateRange } from './internal/dates';
export { AppAlert, type AppAlertProps } from './components/AppAlert/AppAlert';
export { AppSpinner, type AppSpinnerProps } from './components/AppSpinner/AppSpinner';
export { AppProgress, type AppProgressProps } from './components/AppProgress/AppProgress';
export { AppAccordion, type AppAccordionProps, type AccordionItem } from './components/AppAccordion/AppAccordion';
export { AppDrawer, type AppDrawerProps } from './components/AppDrawer/AppDrawer';
export { AppBreadcrumb, type AppBreadcrumbProps, type BreadcrumbItem } from './components/AppBreadcrumb/AppBreadcrumb';
export { AppSlider, type AppSliderProps } from './components/AppSlider/AppSlider';
export { AppFileUpload, type AppFileUploadProps } from './components/AppFileUpload/AppFileUpload';
export { AppDivider, type AppDividerProps } from './components/AppDivider/AppDivider';
export { createBrandTheme, brandThemeCss, applyBrandTheme, contrast, type BrandTheme, type BrandTokens } from './theme/brand';
export { AppBrandStyle, type AppBrandStyleProps } from './theme/AppBrandStyle';

// 아래 별칭이 쓰도록 같은 이름을 가져온다.
import { AppButton, type AppButtonProps } from './components/AppButton/AppButton';
import { AppIconButton, type AppIconButtonProps } from './components/AppIconButton/AppIconButton';
import { AppTooltip, type AppTooltipProps } from './components/AppTooltip/AppTooltip';
import { AppTextInput, type AppTextInputProps } from './components/AppTextInput/AppTextInput';
import { AppTextarea, type AppTextareaProps } from './components/AppTextarea/AppTextarea';
import { AppCheckbox, type AppCheckboxProps } from './components/AppCheckbox/AppCheckbox';
import { AppRadio, AppRadioGroup, type AppRadioProps, type AppRadioGroupProps } from './components/AppRadio/AppRadio';
import { AppCheckGroup, type AppCheckGroupProps } from './components/AppCheckGroup/AppCheckGroup';
import { AppSwitch, type AppSwitchProps } from './components/AppSwitch/AppSwitch';
import { AppSelect, type AppSelectProps } from './components/AppSelect/AppSelect';
import { AppMultiSelect, type AppMultiSelectProps } from './components/AppMultiSelect/AppMultiSelect';
import { AppCalendar, type AppCalendarProps } from './components/AppDatepicker/AppCalendar';
import { AppDatepicker, type AppDatepickerProps } from './components/AppDatepicker/AppDatepicker';
import { AppModal, AppConfirmModal, type AppModalProps, type AppConfirmModalProps } from './components/AppModal/AppModal';
import { AppToast, AppToastProvider, type AppToastProps, type AppToastProviderProps } from './components/AppToast/AppToast';
import { AppCard, AppCardHeader, AppCardBody, AppCardFooter, AppStatCard, type AppCardProps, type AppCardHeaderProps, type AppStatCardProps } from './components/AppCard/AppCard';
import { AppTabs, type AppTabsProps } from './components/AppTabs/AppTabs';
import { AppTable, type AppTableProps } from './components/AppTable/AppTable';
import { AppBadge, type AppBadgeProps } from './components/AppBadge/AppBadge';
import { AppPagination, type AppPaginationProps } from './components/AppPagination/AppPagination';
import { AppChip, type AppChipProps } from './components/AppChip/AppChip';
import { AppDropdownMenu, type AppDropdownMenuProps } from './components/AppDropdownMenu/AppDropdownMenu';
import { AppPopover, type AppPopoverProps } from './components/AppPopover/AppPopover';
import { AppAvatar, AppAvatarGroup, type AppAvatarProps, type AppAvatarGroupProps } from './components/AppAvatar/AppAvatar';
import { AppSkeleton, type AppSkeletonProps } from './components/AppSkeleton/AppSkeleton';
import { AppAlert, type AppAlertProps } from './components/AppAlert/AppAlert';
import { AppSpinner, type AppSpinnerProps } from './components/AppSpinner/AppSpinner';
import { AppProgress, type AppProgressProps } from './components/AppProgress/AppProgress';
import { AppAccordion, type AppAccordionProps } from './components/AppAccordion/AppAccordion';
import { AppDrawer, type AppDrawerProps } from './components/AppDrawer/AppDrawer';
import { AppBreadcrumb, type AppBreadcrumbProps } from './components/AppBreadcrumb/AppBreadcrumb';
import { AppSlider, type AppSliderProps } from './components/AppSlider/AppSlider';
import { AppFileUpload, type AppFileUploadProps } from './components/AppFileUpload/AppFileUpload';
import { AppDivider, type AppDividerProps } from './components/AppDivider/AppDivider';
import { AppBrandStyle, type AppBrandStyleProps } from './theme/AppBrandStyle';

// ── 예전 이름 (v0.4 이전). v0.5에서 지워요. 새 코드는 App 이름을 쓰세요. ──
/** @deprecated `AppButton`를 쓰세요. v0.5에서 지워요. */
export const Button = AppButton;
/** @deprecated `AppIconButton`를 쓰세요. v0.5에서 지워요. */
export const IconButton = AppIconButton;
/** @deprecated `AppTooltip`를 쓰세요. v0.5에서 지워요. */
export const Tooltip = AppTooltip;
/** @deprecated `AppTextInput`를 쓰세요. v0.5에서 지워요. */
export const TextInput = AppTextInput;
/** @deprecated `AppTextarea`를 쓰세요. v0.5에서 지워요. */
export const Textarea = AppTextarea;
/** @deprecated `AppCheckbox`를 쓰세요. v0.5에서 지워요. */
export const Checkbox = AppCheckbox;
/** @deprecated `AppRadio`를 쓰세요. v0.5에서 지워요. */
export const Radio = AppRadio;
/** @deprecated `AppRadioGroup`를 쓰세요. v0.5에서 지워요. */
export const RadioGroup = AppRadioGroup;
/** @deprecated `AppCheckGroup`를 쓰세요. v0.5에서 지워요. */
export const CheckGroup = AppCheckGroup;
/** @deprecated `AppSwitch`를 쓰세요. v0.5에서 지워요. */
export const Switch = AppSwitch;
/** @deprecated `AppSelect`를 쓰세요. v0.5에서 지워요. */
export const Select = AppSelect;
/** @deprecated `AppMultiSelect`를 쓰세요. v0.5에서 지워요. */
export const MultiSelect = AppMultiSelect;
/** @deprecated `AppCalendar`를 쓰세요. v0.5에서 지워요. */
export const Calendar = AppCalendar;
/** @deprecated `AppDatepicker`를 쓰세요. v0.5에서 지워요. */
export const Datepicker = AppDatepicker;
/** @deprecated `AppModal`를 쓰세요. v0.5에서 지워요. */
export const Modal = AppModal;
/** @deprecated `AppConfirmModal`를 쓰세요. v0.5에서 지워요. */
export const ConfirmModal = AppConfirmModal;
/** @deprecated `AppToast`를 쓰세요. v0.5에서 지워요. */
export const Toast = AppToast;
/** @deprecated `AppToastProvider`를 쓰세요. v0.5에서 지워요. */
export const ToastProvider = AppToastProvider;
/** @deprecated `AppCard`를 쓰세요. v0.5에서 지워요. */
export const Card = AppCard;
/** @deprecated `AppCardHeader`를 쓰세요. v0.5에서 지워요. */
export const CardHeader = AppCardHeader;
/** @deprecated `AppCardBody`를 쓰세요. v0.5에서 지워요. */
export const CardBody = AppCardBody;
/** @deprecated `AppCardFooter`를 쓰세요. v0.5에서 지워요. */
export const CardFooter = AppCardFooter;
/** @deprecated `AppStatCard`를 쓰세요. v0.5에서 지워요. */
export const StatCard = AppStatCard;
/** @deprecated `AppTabs`를 쓰세요. v0.5에서 지워요. */
export const Tabs = AppTabs;
/** @deprecated `AppTable`를 쓰세요. v0.5에서 지워요. */
export const Table = AppTable;
/** @deprecated `AppBadge`를 쓰세요. v0.5에서 지워요. */
export const Badge = AppBadge;
/** @deprecated `AppPagination`를 쓰세요. v0.5에서 지워요. */
export const Pagination = AppPagination;
/** @deprecated `AppChip`를 쓰세요. v0.5에서 지워요. */
export const Chip = AppChip;
/** @deprecated `AppDropdownMenu`를 쓰세요. v0.5에서 지워요. */
export const DropdownMenu = AppDropdownMenu;
/** @deprecated `AppPopover`를 쓰세요. v0.5에서 지워요. */
export const Popover = AppPopover;
/** @deprecated `AppAvatar`를 쓰세요. v0.5에서 지워요. */
export const Avatar = AppAvatar;
/** @deprecated `AppAvatarGroup`를 쓰세요. v0.5에서 지워요. */
export const AvatarGroup = AppAvatarGroup;
/** @deprecated `AppSkeleton`를 쓰세요. v0.5에서 지워요. */
export const Skeleton = AppSkeleton;
/** @deprecated `AppAlert`를 쓰세요. v0.5에서 지워요. */
export const Alert = AppAlert;
/** @deprecated `AppSpinner`를 쓰세요. v0.5에서 지워요. */
export const Spinner = AppSpinner;
/** @deprecated `AppProgress`를 쓰세요. v0.5에서 지워요. */
export const Progress = AppProgress;
/** @deprecated `AppAccordion`를 쓰세요. v0.5에서 지워요. */
export const Accordion = AppAccordion;
/** @deprecated `AppDrawer`를 쓰세요. v0.5에서 지워요. */
export const Drawer = AppDrawer;
/** @deprecated `AppBreadcrumb`를 쓰세요. v0.5에서 지워요. */
export const Breadcrumb = AppBreadcrumb;
/** @deprecated `AppSlider`를 쓰세요. v0.5에서 지워요. */
export const Slider = AppSlider;
/** @deprecated `AppFileUpload`를 쓰세요. v0.5에서 지워요. */
export const FileUpload = AppFileUpload;
/** @deprecated `AppDivider`를 쓰세요. v0.5에서 지워요. */
export const Divider = AppDivider;
/** @deprecated `AppBrandStyle`를 쓰세요. v0.5에서 지워요. */
export const BrandStyle = AppBrandStyle;
/** @deprecated `AppButtonProps`를 쓰세요. v0.5에서 지워요. */
export type ButtonProps = AppButtonProps;
/** @deprecated `AppIconButtonProps`를 쓰세요. v0.5에서 지워요. */
export type IconButtonProps = AppIconButtonProps;
/** @deprecated `AppTooltipProps`를 쓰세요. v0.5에서 지워요. */
export type TooltipProps = AppTooltipProps;
/** @deprecated `AppTextInputProps`를 쓰세요. v0.5에서 지워요. */
export type TextInputProps = AppTextInputProps;
/** @deprecated `AppTextareaProps`를 쓰세요. v0.5에서 지워요. */
export type TextareaProps = AppTextareaProps;
/** @deprecated `AppCheckboxProps`를 쓰세요. v0.5에서 지워요. */
export type CheckboxProps = AppCheckboxProps;
/** @deprecated `AppRadioProps`를 쓰세요. v0.5에서 지워요. */
export type RadioProps = AppRadioProps;
/** @deprecated `AppRadioGroupProps`를 쓰세요. v0.5에서 지워요. */
export type RadioGroupProps = AppRadioGroupProps;
/** @deprecated `AppCheckGroupProps`를 쓰세요. v0.5에서 지워요. */
export type CheckGroupProps = AppCheckGroupProps;
/** @deprecated `AppSwitchProps`를 쓰세요. v0.5에서 지워요. */
export type SwitchProps = AppSwitchProps;
/** @deprecated `AppSelectProps`를 쓰세요. v0.5에서 지워요. */
export type SelectProps = AppSelectProps;
/** @deprecated `AppMultiSelectProps`를 쓰세요. v0.5에서 지워요. */
export type MultiSelectProps = AppMultiSelectProps;
/** @deprecated `AppCalendarProps`를 쓰세요. v0.5에서 지워요. */
export type CalendarProps = AppCalendarProps;
/** @deprecated `AppDatepickerProps`를 쓰세요. v0.5에서 지워요. */
export type DatepickerProps = AppDatepickerProps;
/** @deprecated `AppModalProps`를 쓰세요. v0.5에서 지워요. */
export type ModalProps = AppModalProps;
/** @deprecated `AppConfirmModalProps`를 쓰세요. v0.5에서 지워요. */
export type ConfirmModalProps = AppConfirmModalProps;
/** @deprecated `AppToastProps`를 쓰세요. v0.5에서 지워요. */
export type ToastProps = AppToastProps;
/** @deprecated `AppToastProviderProps`를 쓰세요. v0.5에서 지워요. */
export type ToastProviderProps = AppToastProviderProps;
/** @deprecated `AppCardProps`를 쓰세요. v0.5에서 지워요. */
export type CardProps = AppCardProps;
/** @deprecated `AppCardHeaderProps`를 쓰세요. v0.5에서 지워요. */
export type CardHeaderProps = AppCardHeaderProps;
/** @deprecated `AppStatCardProps`를 쓰세요. v0.5에서 지워요. */
export type StatCardProps = AppStatCardProps;
/** @deprecated `AppTabsProps`를 쓰세요. v0.5에서 지워요. */
export type TabsProps = AppTabsProps;
/** @deprecated `AppTableProps`를 쓰세요. v0.5에서 지워요. */
export type TableProps<Row> = AppTableProps<Row>;
/** @deprecated `AppBadgeProps`를 쓰세요. v0.5에서 지워요. */
export type BadgeProps = AppBadgeProps;
/** @deprecated `AppPaginationProps`를 쓰세요. v0.5에서 지워요. */
export type PaginationProps = AppPaginationProps;
/** @deprecated `AppChipProps`를 쓰세요. v0.5에서 지워요. */
export type ChipProps = AppChipProps;
/** @deprecated `AppDropdownMenuProps`를 쓰세요. v0.5에서 지워요. */
export type DropdownMenuProps = AppDropdownMenuProps;
/** @deprecated `AppPopoverProps`를 쓰세요. v0.5에서 지워요. */
export type PopoverProps = AppPopoverProps;
/** @deprecated `AppAvatarProps`를 쓰세요. v0.5에서 지워요. */
export type AvatarProps = AppAvatarProps;
/** @deprecated `AppAvatarGroupProps`를 쓰세요. v0.5에서 지워요. */
export type AvatarGroupProps = AppAvatarGroupProps;
/** @deprecated `AppSkeletonProps`를 쓰세요. v0.5에서 지워요. */
export type SkeletonProps = AppSkeletonProps;
/** @deprecated `AppAlertProps`를 쓰세요. v0.5에서 지워요. */
export type AlertProps = AppAlertProps;
/** @deprecated `AppSpinnerProps`를 쓰세요. v0.5에서 지워요. */
export type SpinnerProps = AppSpinnerProps;
/** @deprecated `AppProgressProps`를 쓰세요. v0.5에서 지워요. */
export type ProgressProps = AppProgressProps;
/** @deprecated `AppAccordionProps`를 쓰세요. v0.5에서 지워요. */
export type AccordionProps = AppAccordionProps;
/** @deprecated `AppDrawerProps`를 쓰세요. v0.5에서 지워요. */
export type DrawerProps = AppDrawerProps;
/** @deprecated `AppBreadcrumbProps`를 쓰세요. v0.5에서 지워요. */
export type BreadcrumbProps = AppBreadcrumbProps;
/** @deprecated `AppSliderProps`를 쓰세요. v0.5에서 지워요. */
export type SliderProps = AppSliderProps;
/** @deprecated `AppFileUploadProps`를 쓰세요. v0.5에서 지워요. */
export type FileUploadProps = AppFileUploadProps;
/** @deprecated `AppDividerProps`를 쓰세요. v0.5에서 지워요. */
export type DividerProps = AppDividerProps;
/** @deprecated `AppBrandStyleProps`를 쓰세요. v0.5에서 지워요. */
export type BrandStyleProps = AppBrandStyleProps;
