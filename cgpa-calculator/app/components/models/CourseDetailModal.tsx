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
					<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-stone-200">
								<div className="flex items-center justify-between mb-6">
									<Dialog.Title className="text-lg font-bold text-stone-900">
										Course Details
									</Dialog.Title>
									<button
										onClick={onClose}
										className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
									>
										<X className="w-4 h-4 text-stone-600" />
									</button>
								</div>

								<div className="space-y-5">
									<div>
										<h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider">Course Code</h3>
										<p className="mt-1 text-stone-900 font-semibold">{course.course_code}</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider">Grade</h3>
											<span className={`mt-1 inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${getGradeColor(course.grade)}`}>
												{course.grade}
											</span>
										</div>
										<div>
											<h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider">Credit Hours</h3>
											<p className="mt-1 text-stone-900 font-semibold">{course.credit_hours}</p>
										</div>
									</div>

									<div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
										<h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">Marks Breakdown</h3>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-xs text-stone-500">Mid Term</p>
												<p className="text-sm font-semibold text-stone-900">{course.mid}</p>
											</div>
											<div>
												<p className="text-xs text-stone-500">Assignment</p>
												<p className="text-sm font-semibold text-stone-900">{course.assignment}</p>
											</div>
											<div>
												<p className="text-xs text-stone-500">Final</p>
												<p className="text-sm font-semibold text-stone-900">{course.final}</p>
											</div>
											<div>
												<p className="text-xs text-stone-500">Practical</p>
												<p className="text-sm font-semibold text-stone-900">{course.practical}</p>
											</div>
										</div>
										<div className="mt-4 pt-4 border-t border-stone-200">
											<div className="flex justify-between items-center">
												<p className="text-sm font-medium text-stone-500">Total Marks</p>
												<p className="text-2xl font-bold text-primary-600">{course.total}</p>
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
