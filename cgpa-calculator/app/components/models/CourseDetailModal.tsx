import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X } from 'lucide-react'
import { CourseRow } from '../../types'
import { getGradeColor } from '../../utils/gradeUtils'

interface CourseDetailModalProps {
	isOpen: boolean
	onClose: () => void
	course: CourseRow
}

export const CourseDetailModal = ({ isOpen, onClose, course }: CourseDetailModalProps) => {
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
								<div className="flex items-center justify-between mb-4">
									<Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										Course Details
									</Dialog.Title>
									<button
										onClick={onClose}
										className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
									>
										<X className="w-5 h-5" />
									</button>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Code</h3>
										<p className="mt-1 text-gray-900 dark:text-gray-100">{course.course_code}</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Grade</h3>
											<span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(course.grade)}`}>
												{course.grade}
											</span>
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Credit Hours</h3>
											<p className="mt-1 text-gray-900 dark:text-gray-100">{course.credit_hours}</p>
										</div>
									</div>

									<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Marks Breakdown</h3>
										<div className="grid grid-cols-2 gap-3">
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">Mid Term</p>
												<p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.mid}</p>
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">Assignment</p>
												<p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.assignment}</p>
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">Final</p>
												<p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.final}</p>
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">Practical</p>
												<p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.practical}</p>
											</div>
										</div>
										<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
											<div className="flex justify-between items-center">
												<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Marks</p>
												<p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{course.total}</p>
											</div>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
